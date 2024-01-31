# Ubuntu 22.04 이미지를 기반으로 설정
FROM ubuntu:22.04

# 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    snapd \
    aptitude \
    git \
    wget \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    ninja-build \
    libgstreamer1.0-dev \
    libgirepository1.0-dev \
    libunwind-dev \
    apt-utils \
    gdb \
    libmicrohttpd-dev \
    libjansson-dev \
    libnice-dev \
    libssl-dev \
    libsofia-sip-ua-dev \
    libglib2.0-dev \
    libopus-dev \
    libogg-dev \
    libconfig-dev \
    libavutil-dev \
    libavcodec-dev \
    libavformat-dev \
    libnanomsg-dev \
    libcurl4-openssl-dev \
    liblua5.3-dev \
    pkg-config \
    gengetopt \
    libtool \
    automake \
    curl \
    jq \
    httpie \
    vim \
    screen \
    doxygen \
    graphviz \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Python 패키지 meson과 ninja 설치
RUN python3 -m pip install meson ninja

# Go 언어 설치
RUN wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz \
    && rm -rf /usr/local/go \
    && tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
ENV PATH $PATH:/usr/local/go/bin

# libnice 설치
RUN cd / \
    && git clone https://gitlab.freedesktop.org/libnice/libnice \
    && cd libnice \
    && meson --prefix=/usr build && ninja -C build && ninja -C build install

# libsrtp 설치
RUN cd / \
    && wget https://github.com/cisco/libsrtp/archive/v2.5.0.tar.gz \
    && tar xfv v2.5.0.tar.gz \
    && cd libsrtp-2.5.0/ \
    && ./configure --prefix=/usr --enable-openssl \
    && make shared_library && make install

# BoringSSL 설치
RUN cd / \
    && git clone https://boringssl.googlesource.com/boringssl \
    && cd boringssl \
    && sed -i s/" -Werror"//g CMakeLists.txt \
    && mkdir -p build \
    && cd build \
    && apt-get update && apt-get install -y cmake \
    && cmake -DCMAKE_CXX_FLAGS="-lrt" .. \
    && make \
    && cd .. \
    && mkdir -p /opt/boringssl \
    && cp -R include /opt/boringssl/ \
    && mkdir -p /opt/boringssl/lib \
    && cp build/ssl/libssl.a /opt/boringssl/lib/ \
    && cp build/crypto/libcrypto.a /opt/boringssl/lib/

# usrsctp 설치
RUN cd / \
    && git clone https://github.com/sctplab/usrsctp \
    && cd usrsctp \
    && ./bootstrap \
    && ./configure --prefix=/usr --disable-programs --disable-inet --disable-inet6 \
    && make && make install

# libwebsocket 설치
RUN cd / \
    # && git clone https://libwebsockets.org/repo/libwebsockets \
    && git clone https://github.com/warmcat/libwebsockets.git \
    && cd libwebsockets \
    # If you want the stable version of libwebsockets, uncomment the next line
    # git checkout v4.3-stable
    && mkdir build \
    && cd build \
    # See https://github.com/meetecho/janus-gateway/issues/732 re: LWS_MAX_SMP
    # See https://github.com/meetecho/janus-gateway/issues/2476 re: LWS_WITHOUT_EXTENSIONS
    && cmake -DLWS_MAX_SMP=1 -DLWS_WITHOUT_EXTENSIONS=0 -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_C_FLAGS="-fpic" .. \
    && make && make install

RUN cd / \
    && git clone https://github.com/eclipse/paho.mqtt.c.git \
    && cd paho.mqtt.c \
    && make && make install

RUN cd / \
    && aptitude install libnanomsg-dev

RUN cd / \
    && git clone https://github.com/alanxz/rabbitmq-c \
    && cd rabbitmq-c \
    && git submodule init \
    && git submodule update \
    && mkdir build && cd build \
    && cmake -DCMAKE_INSTALL_PREFIX=/usr .. \
    && make && make install

RUN cd / \
    && aptitude install doxygen graphviz

# Janus WebRTC 서버 소스 코드 복제
RUN cd / \
    && git clone https://github.com/meetecho/janus-gateway.git

# Janus 컴파일 및 설치
RUN cd /janus-gateway \
    && sh autogen.sh \
    && ./configure --prefix=/opt/janus \
    && make \
    && make install \
    && make configs \
    # 밑에 두개 취향
    && ./configure --enable-docs \
    && ./configure --disable-websockets --disable-data-channels --disable-rabbitmq --disable-mqtt

# Dockerfile과 같은 위치에 있는 janus.transport.http.jcfg를 복사
COPY janus.transport.http.jcfg /opt/janus/etc/janus/janus.transport.http.jcfg
COPY janus.jcfg /opt/janus/etc/janus/janus.jcfg

RUN rm -rf \
    /libnice \
    /libsrtp-2.5.0 \
    /v2.5.0.tar.gz \
    /boringssl \
    /usrsctp \
    /libwebsockets \
    /paho.mqtt.c \
    /rabbitmq-c \
    /janus-gateway

EXPOSE 8088 8089 7088 7089 8188 8989

CMD ["/opt/janus/bin/janus"]
