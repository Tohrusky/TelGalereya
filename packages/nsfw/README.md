# NSFW

A Node.js server for NSFW image classification using TensorFlow.js.

See Enviorment Variables in [config](./config.ts).

### Usage

Fork and deploy to Vercel! Just Set the `MYSQL_DATABASE_URL` environment variable to your [MySQL database URL](https://www.prisma.io/docs/concepts/database-connectors/mysql).

Example: TiDB Serverless

```bash
MYSQL_DATABASE_URL="mysql://xxxxxxxxxxxxx.root:effew4363636jjfdi66@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/NSFW_SERVERLESS?sslaccept=strict"
```

### Docker

Enable OCR if your machine is powerful enough.

```bash
docker run -d --restart=always -p 80:3008 --name nsfw -e OCR_SENSITIVE="true" -e MYSQL_DATABASE_URL="mysql://xxxx" lychee0/nsfw
```
