# UNISIZE MVP

교복 매장의 측정 → 주문 승인 → 재고 배정 → 발주·입고 → 수선·명찰 → 준비 완료 → 수령을 관리하는 MVP입니다.

## 기술 구성

- Next.js 15 App Router / React 19 / TypeScript
- Node.js 기반 Route Handler API
- PostgreSQL 16 / Prisma ORM
- AWS 배포를 위한 standalone 빌드

## 로컬 실행

```bash
cp .env.example .env
docker compose up -d db
npm install
npx prisma db push
npm run db:seed
npm run dev
```

- 고객 시작: `http://localhost:3000`
- 매장 관리자: `http://localhost:3000/admin`
- 상태 확인: `http://localhost:3000/api/health`

## 핵심 설계

- 스태프 승인 시점에만 재고를 배정합니다.
- 재고 배정은 PostgreSQL의 Serializable 트랜잭션과 조건부 UPDATE로 초과 배정을 방지합니다.
- 주문, 품목별 수령 방식, 수선·명찰, 결제, 수령 증빙, 문자 로그, 감사 로그를 분리 저장합니다.
- 발주 제안은 `예약 수요 - 가용 재고 - 미입고 발주`를 0 미만이 되지 않게 계산합니다.

## AWS 배포 권장안

초기에는 비용과 운영 복잡도를 낮추기 위해 아래 구성을 권장합니다.

- Application Load Balancer → ECS Fargate (Next.js standalone 컨테이너)
- Amazon RDS for PostgreSQL (Multi-AZ는 실제 운영 전 활성화)
- ECR 이미지 저장소, Secrets Manager 환경변수 관리
- CloudWatch Logs/Alarms, AWS Backup 또는 RDS 자동 백업
- 정적 자산이 커지면 S3 + CloudFront 추가

운영 환경에서는 개발/운영 AWS 계정 또는 최소한 VPC·DB·시크릿을 분리하고, RDS는 private subnet에 둡니다.
