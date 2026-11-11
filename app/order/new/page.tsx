import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { MobileShell } from "@/components/mobile-shell";
import { OrderCreateForm } from "@/components/order-create-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic="force-dynamic";
export default async function NewOrderPage({searchParams}:{searchParams:Promise<{studentId?:string}>}){const user=await getCurrentUser();const {studentId}=await searchParams;if(!user||!studentId)redirect("/visit");const student=await prisma.student.findUnique({where:{id:studentId},include:{school:{include:{products:{include:{product:{include:{skus:{include:{inventory:true}}}}}}}}}});if(!student||student.userId!==user.id)redirect("/visit");const products=student.school.products.map(sp=>({id:sp.product.id,name:sp.product.name,price:sp.price,required:sp.isRequired,skus:sp.product.skus.map(s=>({id:s.id,size:s.size,available:(s.inventory?.onHand??0)-(s.inventory?.reserved??0)}))}));return <MobileShell backHref="/visit" title={<Brand small/>}><section className="px-7 py-8"><p className="text-12 font-bold text-primary-500">{student.school.name}</p><h1 className="mt-3 text-24 font-bold">{student.name} 학생의<br/>사이즈를 선택해주세요.</h1><p className="mt-2 text-14 text-gray-500">스태프 승인 후 재고가 순서대로 배정됩니다.</p><OrderCreateForm studentId={student.id} products={products}/></section></MobileShell>}
