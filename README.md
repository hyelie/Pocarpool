# Pocarpool - POSTECH Carpool Application

<p align="center">
<a href="https://gitlab.com/hyelie/carpool_backend/-/wikis/home">개발 위키</a> 
| 
<a href="https://gitlab.com/hyelie/carpool_backend/-/issues">이슈</a> 
| 
<a href="https://gitlab.com/hyelie/carpool_backend/-/milestones">마일스톤</a> 
</p>

## 기능


## 초기 환경 구성(Getting started)
### NVM
#### NVM 설치
다음과 같이 NVM을 설치합니다. NVM 버전은 [공식 github]((https://github.com/nvm-sh/nvm/#install--update-script))에서 버전을 확인할 수 있습니다.

```
# vx.xx.x부분의 버전은 공식 git에서 확인 한 후 변경
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/vx.xx.x/install.sh | bash

ex) curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc

$ nvm -v
0.38.0
```

#### Node 버전 설정
NVM이 설치되어 있다면 아래 명령어를 실행시켜서 Node v16.17.0 (LTS)를 설정합니다.
```
nvm install 16.17.0
nvm use 16.17

$ npm -v
8.15.0
$ node -v
v16.17.0
```

#### 프로젝트 설치
```
git clone https://gitlab.com/hyelie/carpool_backend.git
cd code/carpool-backend
npm i                        # node module 설치
node ./bin/www               # 서버 실행
```


## 기술 스택



## 팀 정보
