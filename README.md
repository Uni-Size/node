# UNISIZE

교복 매장의 측정 → 주문 승인 → 재고 배정 → 발주·입고 → 수선·명찰 → 준비 완료 → 수령을 관리하는 서비스입니다.

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

관리자 계정은 `.env`의 `ADMIN_EMAIL`, `ADMIN_PASSWORD`로 생성됩니다. 운영 전에 기본 비밀번호를 반드시 변경하고 `npm run db:seed`를 다시 실행하세요.

- 고객 시작: `http://localhost:3000`
- 매장 관리자: `http://localhost:3000/admin`
- 관리자 로그인: `http://localhost:3000/staff-login`
- 상태 확인: `http://localhost:3000/api/health`

## 디자인 시스템

unisize-front의 디자인 토큰을 그대로 가져왔습니다(원본 가이드: `unisize-front/docs/STYLE_GUIDE.md`).

- 토큰 원본은 `tokens/*.json`이고, `npm run tokens:build`가 `app/tokens.generated.css`(Tailwind v4 `@theme`)를 만듭니다. `dev`/`build` 전에 자동 실행됩니다.
- 색은 primary / gray / red / yellow / green / blue 6개 팔레트(050~900), 글자 크기는 `text-11`~`text-24` + 이 프로젝트에만 있는 `text-32`·`text-48`(랜딩 헤드라인)만 씁니다. Tailwind 기본 팔레트·크기는 `app/globals.css`에서 꺼 두었습니다.
- 공통 컴포넌트는 `components/ui/`(Button·Input·Badge·Table), 아이콘은 `components/icons/icons.tsx` + lucide-react, 마스코트는 `public/student/*.svg`.

## 핵심 설계

- 스태프 승인 시점에만 재고를 배정합니다.
- 재고 배정은 PostgreSQL의 Serializable 트랜잭션과 조건부 UPDATE로 초과 배정을 방지합니다.
- 주문, 품목별 수령 방식, 수선·명찰, 결제, 수령 증빙, 문자 로그, 감사 로그를 분리 저장합니다.
- 발주 제안은 `예약 수요 - 가용 재고 - 미입고 발주`를 0 미만이 되지 않게 계산합니다.
- 관리자·스태프 화면은 서버 세션과 역할 검사로 보호합니다.
- 고객 등록 세션은 본인이 생성한 학생과 주문에만 접근할 수 있습니다.

## 운영 반영 전 필수 설정

로컬 개발에서는 `db:push`를 사용할 수 있지만 운영 DB는 마이그레이션으로 반영합니다.

```bash
npm run db:migrate -- --name service_core
npm run db:deploy
```

현재 SMS 공급자 연동은 포함하지 않습니다. 휴대폰 재방문 인증과 준비 완료 문자 발송을 운영하려면 공급자 연결이 필요합니다. 연결 전에는 신규 등록 세션과 매장 스태프 확인 흐름만 사용하세요.

## EC2 배포 (개발 기간)

EC2 한 대에서 `docker-compose.prod.yml`로 Caddy(HTTPS) + 앱 + PostgreSQL을 함께 띄웁니다. 월 약 $15~18.

### 1. 인스턴스 준비 (AWS 콘솔)

- EC2: Amazon Linux 2023, **t4g.small** (arm64), EBS gp3 20GB
- 보안 그룹 인바운드: 22(내 IP만), 80, 443 (0.0.0.0/0)
- Elastic IP 할당 후 인스턴스에 연결
- 백업: EC2 → Lifecycle Manager에서 해당 볼륨 일일 스냅샷 정책 생성

### 2. 서버 초기 설정 (최초 1회)

```bash
ssh ec2-user@<EIP>
sudo dnf install -y docker git
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-aarch64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
# 빌드 중 메모리 부족 방지용 스왑 2GB
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
exit   # 재접속해야 docker 그룹 적용
```

### 3. 코드와 환경변수

```bash
git clone https://github.com/Uni-Size/node.git unisize && cd unisize
cat > .env <<EOF
POSTGRES_PASSWORD=$(openssl rand -hex 24)
ADMIN_EMAIL=admin@unisize.local
ADMIN_PASSWORD=<8자 이상 강한 비밀번호>
SITE_ADDRESS=<EIP의 점을 대시로>.sslip.io
EOF
chmod 600 .env
```

`SITE_ADDRESS`는 EIP가 `3.35.1.2`라면 `3-35-1-2.sslip.io`입니다. 도메인 없이도 Caddy가 Let's Encrypt 인증서를 받습니다. 도메인이 생기면 A 레코드를 EIP로 연결하고 이 값만 바꾸세요. HTTPS가 필수인 이유는 운영 모드에서 세션 쿠키가 `secure`라서 HTTP로는 로그인이 되지 않기 때문입니다.

### 4. 배포 (최초 및 업데이트 시 동일)

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f migrate app   # 확인용
```

`migrate` 서비스가 매번 `prisma migrate deploy`와 시드(관리자 계정 비밀번호를 `.env` 값으로 맞추고 데모 데이터 upsert)를 실행한 뒤 앱이 뜹니다. 스키마를 바꿀 때는 로컬에서 `npm run db:migrate -- --name <이름>`으로 마이그레이션을 만들어 커밋하세요.

접속: `https://<SITE_ADDRESS>`, 관리자 로그인 `https://<SITE_ADDRESS>/staff-login`

### 5. CI/CD (GitHub Actions)

`main`에 push하면 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)이 타입 체크·테스트 후 EC2에 SSH로 접속해 4단계를 자동 실행하고 `/api/health`로 확인합니다. Actions 탭에서 수동 실행(`workflow_dispatch`)도 됩니다.

최초 1회 설정:

```bash
# (서버) 저장소가 private이므로 읽기 전용 deploy key 생성
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519 && cat ~/.ssh/id_ed25519.pub
# → GitHub 저장소 Settings → Deploy keys에 등록 (Allow write access 체크 해제)
git clone git@github.com:Uni-Size/node.git ~/unisize   # 3단계의 https clone 대신

# (로컬) Actions가 서버에 접속할 키 생성
ssh-keygen -t ed25519 -N "" -f ./gha_deploy -C github-actions
ssh-copy-id -i ./gha_deploy.pub ec2-user@<EIP>
ssh-keyscan <EIP>          # 출력 전체가 EC2_KNOWN_HOSTS 값
```

GitHub 저장소 Settings → Secrets and variables → Actions에 등록:

| 이름 | 값 |
|---|---|
| `EC2_HOST` | EIP |
| `EC2_USER` | `ec2-user` |
| `EC2_SSH_KEY` | `gha_deploy` 파일 내용(개인키) |
| `EC2_KNOWN_HOSTS` | `ssh-keyscan` 출력 |
| `SITE_ADDRESS` | `.env`의 `SITE_ADDRESS`와 동일 |

등록 후 로컬의 `gha_deploy*` 파일은 삭제하세요. 보안 그룹의 22번 포트는 GitHub Actions IP가 고정이 아니므로 0.0.0.0/0으로 열어야 합니다. 비밀번호 로그인은 Amazon Linux 기본값대로 꺼져 있어 키 인증만 허용됩니다. 22번을 닫고 싶으면 SSM Run Command(OIDC)로 전환하세요.

### 실제 운영 전환 시

DB가 EC2와 같은 인스턴스에 있어 인스턴스 장애가 곧 서비스 장애입니다. 매장 운영 전에는 아래 구성으로 옮깁니다(같은 이미지 재사용, DB는 `pg_dump` → RDS restore 후 `DATABASE_URL`만 교체).

- Application Load Balancer → ECS Fargate (Next.js standalone 컨테이너)
- Amazon RDS for PostgreSQL (Multi-AZ는 실제 운영 전 활성화)
- ECR 이미지 저장소, Secrets Manager 환경변수 관리
- CloudWatch Logs/Alarms, AWS Backup 또는 RDS 자동 백업
- 정적 자산이 커지면 S3 + CloudFront 추가

운영 환경에서는 개발/운영 AWS 계정 또는 최소한 VPC·DB·시크릿을 분리하고, RDS는 private subnet에 둡니다.
