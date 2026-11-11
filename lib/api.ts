// 클라이언트 폼용 POST. 실패하면 화면에 그대로 보여줄 한글 메시지로 Error를 던진다.
export async function postJson<T = unknown>(url: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw new Error("네트워크 연결을 확인한 뒤 다시 시도해주세요.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? (response.status >= 500 ? "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." : "요청을 처리하지 못했습니다."));
  return data as T;
}
