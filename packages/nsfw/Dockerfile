FROM node:alpine

WORKDIR /build

COPY . .
# 减小镜像体积，仅安装子包的依赖

RUN npm install && npm run build

ENV MYSQL_DATABASE_URL "mysql://xxxxxxxxxxxxx.root:effew4363636jjfdi66@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/NSFW_SERVERLESS?sslaccept=strict"
ENV IMAGE_RESIZE_WIDTH 225
ENV NSFW_VALUE 0.7
ENV OCR_SENSITIVE false
ENV OCR_API_KEY ""
ENV SENSITIVE_WORDS "https://raw.githubusercontent.com/Tohrusky/chinese-sensitive-go/main/dict/boss.txt"
ENV TENSORFLOW_BACKEND wasm

EXPOSE 3008

CMD ["node", "/build/dist/index.js"]