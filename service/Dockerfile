FROM ubuntu:latest

MAINTAINER Petter Aas <petter@fronter.com>

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
RUN apt-get install -y git-core build-essential sudo python-dev curl
RUN curl http://python-distribute.org/distribute_setup.py | python
RUN curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py | python
RUN pip install pretty
RUN cd /tmp; git clone https://github.com/joyent/node.git;
RUN cd /tmp/node; git fetch origin --tags;
RUN cd /tmp/node; git checkout v0.10.25;
RUN cd /tmp/node; ./configure;
RUN cd /tmp/node; make;
RUN cd /tmp/node; make install
ADD . /src
RUN cd /src/; npm install; mkdir logs; npm start;
EXPOSE 3000:3000
