# 编译dist
FROM node:alpine AS builder

WORKDIR /build

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN cd ./packages/nsfw && pnpm run build

# 安装最小依赖
FROM node:alpine AS node_modules

WORKDIR /build

COPY . .

RUN npm install -g pnpm
RUN pnpm install --prod --filter nsfw...

# 多阶段构建，减小镜像体积
FROM node:alpine

WORKDIR /app

COPY --from=node_modules /build/node_modules /app/node_modules
COPY --from=node_modules /build/packages/nsfw/node_modules /app/packages/nsfw/node_modules
COPY --from=builder /build/packages/nsfw/dist /app/packages/nsfw/dist


ENV MYSQL_DATABASE_URL "mysql://xxxxxxxxxxxxx.root:effew4363636jjfdi66@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/NSFW_SERVERLESS?sslaccept=strict"
ENV IMAGE_RESIZE_WIDTH 225
ENV NSFW_VALUE 0.7
ENV OCR_SENSITIVE false
ENV OCR_API_KEY ""
ENV SENSITIVE_WORDS "https://raw.githubusercontent.com/Tohrusky/chinese-sensitive-go/main/dict/boss.txt"
ENV TENSORFLOW_BACKEND wasm

EXPOSE 3008

CMD ["node", "/app/packages/nsfw/dist/index.js"]
