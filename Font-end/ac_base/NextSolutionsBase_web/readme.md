## Upgrade Angular 8 to 9
https://update.angular.io/#8.0:9.0l3

https://www.angularjswiki.com/angular/update-angular-cli-version-ng-update-to-latest-6-7-versions/

npm install --no-save @angular/cli@^8.3.26

ng update @angular/cli @angular/core --allow-dirty

if exist "node_modules" rmdir /s /q "node_modules"

npm install

ng update rxjs --allow-dirty

ng update @angular/material @angular/flex-layout @angular/cdk @swimlane/ngx-charts --allow-dirty

npm uninstall -g angular-cli

npm cache clean

npm install -g @angular/cli@latest

## Link base library to project
angular.json Tìm đến vị trí: \

"projects": {\
    "CMS": {\
        "architect": {\
            "build": {\
                "builder": "@angular-devkit/build-angular:browser",\
                "options": {\
                  "preserveSymlinks": true, -> Bổ sung đây nhé\
                  "outputPath": "dist/Sharewarehouse",\
                  .......

tsconfig.json Tìm đến vị trí: \

"compilerOptions": { \
     ... \
     "paths": { \
       "@next-solutions/next-solutions-base": [ \
         "dist/next-solutions-base" \
       ] \
     }, \
     ....

package.json thêm "scripts"

"delete:lib:built": "if exist \"./../NextSolutionsBase_lib\" rmdir /s /q \"./../NextSolutionsBase_lib\"", \
"delete:lib:install": "if exist \"node_modules/@next-solutions/next-solutions-base\" rmdir /s /q \"node_modules/@next-solutions/next-solutions-base\"", \
"delete:lib": "npm run delete:lib:built && npm run delete:lib:install", \
"ng-packagr": "ng-packagr -p \"./../NextSolutionsBase_web/ng-packagr.json\"", \
"build:lib:copyNewFiles": "xcopy \"./../../Sharedwarehouse/NextSolutionsBase_lib\" \"node_modules/@next-solutions/next-solutions-base\" /s/h/e/k/f/c/i", \
"install:local": "npm install \"./../../Sharedwarehouse/NextSolutionsBase_lib\" --save", \
"build:lib": "npm run delete:lib && npm run ng-packagr && npm run install:local", \

## Upgrade Angular 9 to 10
https://update.angular.io/?l=3&v=9.1-10.0
- ng update @angular/core@10.1.6 @angular/cli@10.1.6 --allow-dirty --force
- ng update @angular/material@10.2.5 --allow-dirty --force
- Update các @angular còn lại lên mới nhất và kiểm tra version tương thích của các thư viện bên thứ 3 
