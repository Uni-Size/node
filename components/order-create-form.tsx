"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";

type Product={id:string;name:string;price:number;required:boolean;skus:{id:string;size:string;available:number}[]};
export function OrderCreateForm({studentId,products}:{studentId:string;products:Product[]}){
  const router=useRouter(); const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const [idempotencyKey]=useState(()=>crypto.randomUUID());
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError("");setLoading(true);const f=new FormData(e.currentTarget);const items=products.flatMap(p=>{const skuId=f.get(`sku-${p.id}`)?.toString();if(!skuId)return[];return[{skuId,quantity:Number(f.get(`qty-${p.id}`)||1),fulfillment:f.get(`fulfillment-${p.id}`)==="DELIVERY"?"DELIVERY":"PICKUP"}]});let j:{id:string};try{j=await postJson("/api/orders",{idempotencyKey,studentId,items});}catch(err){setLoading(false);return setError((err as Error).message);}router.replace(`/order/${j.id}`);}
  return <form onSubmit={submit} className="mt-6 flex flex-col gap-4">{products.map(p=><article key={p.id} className="border border-gray-100 rounded-lg p-4"><div className="flex justify-between"><div><b className="text-15">{p.name}</b>{p.required&&<span className="ml-2 text-11 text-primary-500">필수</span>}</div><span className="text-14">{p.price.toLocaleString("ko-KR")}원</span></div><div className="grid grid-cols-3 gap-2 mt-3"><select name={`sku-${p.id}`} required={p.required} className="col-span-1 h-10 px-2 border border-gray-200 rounded-lg"><option value="">선택 안 함</option>{p.skus.map(s=><option key={s.id} value={s.id}>{s.size} (재고 {s.available})</option>)}</select><input name={`qty-${p.id}`} type="number" min={1} max={10} defaultValue={1} className="h-10 px-2 border border-gray-200 rounded-lg"/><select name={`fulfillment-${p.id}`} className="h-10 px-2 border border-gray-200 rounded-lg"><option value="PICKUP">매장 수령</option><option value="DELIVERY">택배</option></select></div></article>)}{products.length===0&&<p className="text-14 text-gray-500">학교에 등록된 판매 상품이 없습니다. 매장에 문의해주세요.</p>}{error&&<ErrorMessage>{error}</ErrorMessage>}<Button type="submit" size="large" disabled={loading||products.length===0}>{loading?"주문 저장 중...":"주문 확정 요청"}</Button></form>;
}
