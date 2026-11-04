import { NextResponse } from "next/server";
export function GET(){ return NextResponse.json({status:"ok", service:"unisize", timestamp:new Date().toISOString()}); }
