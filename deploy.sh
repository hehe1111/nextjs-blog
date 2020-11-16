echo '=== Start deploy ==='
docker container start postgresql1 &&
cd /home/blog/app/nextjs-blog &&
git reset --hard HEAD &&
git pull &&
yarn --production=false &&
rm -rf ./.next/ &&
yarn build &&
git apply 'db-src-entity-User.ts.patch' &&
yarn compile:src &&
yarn m:run &&
git reset --hard HEAD &&
docker build -t hehe1111/nextjs-blog . &&
docker kill nextjs-blog
docker rm nextjs-blog
docker run --name nextjs-blog --network host -p 3000:3000 --env-file .env.local -d hehe1111/nextjs-blog &&
echo '=== End delopy ==='
