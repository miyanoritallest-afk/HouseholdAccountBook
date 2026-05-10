FROM ruby:3.3-slim

RUN apt-get update -qq && apt-get install -y \
  build-essential \
  default-libmysqlclient-dev \
  libyaml-dev \
  git \
  curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock* ./
RUN bundle install

COPY . .
RUN chmod +x bin/*

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb", "-p", "3000", "-e", "production"]
