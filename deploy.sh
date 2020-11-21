echo '=== Start deploy ==='
docker container start postgresql1 &&
cd /home/blog/app/nextjs-blog &&
git reset --hard HEAD &&
git pull &&
yarn --production=false &&
rm -rf ./.next/ &&
yarn build &&
yarn compile:src &&
yarn m:run &&
docker build -t hehe1111/nextjs-blog . &&
docker kill nextjs-blog nginx1
docker rm nextjs-blog nginx1
docker run --name nextjs-blog --network host -p 3000:3000 --env-file .env.local -d hehe1111/nextjs-blog &&
docker run --name nginx1 --network host -v /home/blog/app/nextjs-blog/nginx.conf:/etc/nginx/conf.d/default.conf -v /home/blog/app/nextjs-blog/.next/static/:/usr/share/nginx/html/_next/static/ -d nginx &&
echo '=== End delopy ==='
