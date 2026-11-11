import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ idempotencyKey:z.string().uuid(), studentId:z.string().cuid(), items:z.array(z.object({ skuId:z.string().cuid(), quantity:z.number().int().min(1).max(10), fulfillment:z.enum(["PICKUP","DELIVERY"]) })).min(1) });

export async function POST(request:Request){
  const user=await getCurrentUser(); if(!user)return NextResponse.json({message:"다시 학생 확인을 진행해주세요."},{status:401});
  const parsed=schema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return NextResponse.json({message:"주문 품목을 확인해주세요."},{status:400});
  const student=await prisma.student.findUnique({where:{id:parsed.data.studentId}}); if(!student||student.userId!==user.id)return NextResponse.json({message:"학생 정보에 접근할 수 없습니다."},{status:403});
  const skuIds=parsed.data.items.map(i=>i.skuId); const schoolProducts=await prisma.schoolProduct.findMany({where:{schoolId:student.schoolId,product:{skus:{some:{id:{in:skuIds}}}}},include:{product:{include:{skus:{where:{id:{in:skuIds}}}}}}});
  const priceBySku=new Map(schoolProducts.flatMap(sp=>sp.product.skus.map(sku=>[sku.id,sp.price] as const))); if(priceBySku.size!==new Set(skuIds).size)return NextResponse.json({message:"판매할 수 없는 품목이 포함되어 있습니다."},{status:400});
  const orderNumber=`UN-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  const {idempotencyKey}=parsed.data;
  // 같은 키로 재시도하면(응답 유실 등) 새로 만들지 않고 기존 주문을 돌려준다
  const existing=await prisma.order.findUnique({where:{idempotencyKey}}); if(existing){if(existing.studentId!==student.id)return NextResponse.json({message:"학생 정보에 접근할 수 없습니다."},{status:403});return NextResponse.json({id:existing.id,orderNumber:existing.orderNumber},{status:200});}
  let order; try{order=await prisma.$transaction(async tx=>{const created=await tx.order.create({data:{orderNumber,idempotencyKey,studentId:student.id,status:"PENDING_APPROVAL",items:{create:parsed.data.items.map(i=>({...i,unitPrice:priceBySku.get(i.skuId)!}))}}});await tx.auditLog.create({data:{userId:user.id,action:"ORDER_SUBMITTED",entityType:"Order",entityId:created.id}});return created;});}
  catch(e){const dup=(e as {code?:string}).code==="P2002"&&await prisma.order.findUnique({where:{idempotencyKey}}); if(!dup||dup.studentId!==student.id)throw e; order=dup;} // 동시 재시도 경합
  return NextResponse.json({id:order.id,orderNumber:order.orderNumber},{status:201});
}
