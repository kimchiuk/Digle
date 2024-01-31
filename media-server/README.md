sudo docker rmi chosami/janus-builder
sudo docker pull chosami/janus-builder
sudo docker run -d -p 8088:8088 -p 8089:8089 -p 8188:8188 -p 8189:8189 -p 7088:7088 -p 7089:7089 -p 7889:7889 chosami/janus-builder

sudo apt install golang-go
git clone https://github.com/FiloSottile/mkcert && cd mkcert
go build -ldflags "-X main.Version=$(git describe --tags)"
