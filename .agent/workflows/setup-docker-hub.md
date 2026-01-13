---
description: 如何配置 Docker Hub 自动构建和推送
---

# Docker Hub 自动构建与推送配置指南

我已经为你重新创建了 GitHub Actions 配置文件 `.github/workflows/docker-image.yml`。

为了让该 workflow 正常工作，你需要在 GitHub 仓库中配置以下 Secrets：

### 1. 获取 Docker Hub Token

- 登录 [Docker Hub](https://hub.docker.com/)。
- 进入 **Account Settings** -> **Security** -> **New Access Token**。
- 创建一个带有 `Read & Write` 权限的 Token 并复制。

### 2. 在 GitHub 中添加 Secrets

- 打开你的 GitHub 仓库页面。
- 点击 **Settings** -> **Secrets and variables** -> **Actions**。
- 点击 **New repository secret**，添加以下两个变量：
  - `DOCKERHUB_USERNAME`: 你的 Docker Hub 用户名。
  - `DOCKERHUB_TOKEN`: 刚才生成的 Docker Hub Access Token。

### 3. 开始使用

配置完成后，每当你推送代码到 `main` 或 `master` 分支时，GitHub 会自动：

1. 构建全新的 Docker 镜像。
2. 将镜像打上 `latest` 和 `commit-sha` 两个标签。
3. 推送镜像到 `${your_username}/trah-nav`。

> **注意**: 如果你的镜像仓库名称不是 `trah-nav`，请修改 `.github/workflows/docker-image.yml` 中的 `tags` 字段。
