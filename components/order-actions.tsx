"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { OrderStatus } from "@prisma/client";

export function OrderActions({id,status}:{id:string;status:OrderStatus}){const router=useRouter();const [loading,setLoading]=useState(false);const [error,setError]=useState("");async function act(action:string){setLoading(true);setError("");let receiverName:string|undefined;if(action==="RECEIVED"){receiverName=window.prompt("수령인 이름을 입력하세요.")??undefined;if(!receiverName){setLoading(false);return;}}const url=action==="APPROVE"?`/api/orders/${id}/approve`:`/api/orders/${id}/status`;try{await postJson(url,action==="APPROVE"?{}:{action,receiverName});}catch(err){return setError((err as Error).message);}finally{setLoading(false);}router.refresh();}let action:string|undefined,label:string|undefined;if(status==="PENDING_APPROVAL"){action="APPROVE";label="승인";}else if(status==="APPROVED"||status==="ALLOCATED"){action="PREPARING";label="준비 시작";}else if(status==="PREPARING"){action="READY";label="전체 준비 완료";}else if(status==="READY"){action="RECEIVED";label="수령 처리";}return <div>{action&&<button onClick={()=>act(action!)} disabled={loading} className="px-2.5 py-1.5 rounded-md bg-primary-900 text-white text-12 disabled:opacity-50">{loading?"처리 중":label}</button>}{error&&<ErrorMessage compact>{error}</ErrorMessage>}</div>}
