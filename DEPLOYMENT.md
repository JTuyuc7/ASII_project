# Deployment Guide

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

1. **Test Suite** (`test.yml`):
   - Runs on every pull request
   - Runs on pushes to feature branches
   - Tests multiple Node.js versions (18, 20)
   - Performs security audits
   - Checks code formatting and linting

2. **CI/CD Pipeline** (`deploy.yml`):
   - Runs tests on all PRs and pushes
   - Deploys to Render only when:
     - Code is merged to `master` branch
     - Manually triggered via workflow dispatch

### Deploy to Render

### Prerequisites

1. **GitHub Repository**: Make sure your code is pushed to a GitHub repository
2. **Render Account**: Create a free account at [render.com](https://render.com)

### Setup Instructions

#### 1. Create a Render Service

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Choose the `deploy-app` branch
5. Configure the service:
   - **Name**: `asii-project` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (for development)

#### 2. Configure GitHub Secrets (Optional - for GitHub Actions)

If you want to use GitHub Actions for deployment automation:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add the following secrets:
   - `RENDER_SERVICE_ID`: Your Render service ID (found in service settings)
   - `RENDER_API_KEY`: Your Render API key (create in Account Settings)

#### 3. Deploy

**Option A: Automatic Deployment (Recommended)**

- Create a pull request to the `master` branch
- Once tests pass and PR is merged, deployment will automatically trigger
- Monitor the deployment in GitHub Actions tab

**Option B: Manual Deployment**

- Go to your GitHub repository
- Navigate to "Actions" tab
- Select "CI/CD Pipeline" workflow
- Click "Run workflow" and choose the environment
- Or go to your Render service dashboard and click "Manual Deploy"

**Option C: Direct Push to Master**

- Push your code directly to the `master` branch (not recommended for production)
- Deployment will automatically trigger after tests pass

### Environment Variables

The following environment variables are automatically configured:

- `NODE_VERSION`: 18
- `NODE_ENV`: production

Add any additional environment variables in the Render dashboard under your service settings.

### Monitoring

- Check deployment logs in the Render dashboard
- Monitor your application at the provided Render URL
- Set up health checks using the `/` endpoint
- View CI/CD pipeline status in GitHub Actions tab

### Development Workflow

1. **Create Feature Branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Develop your feature

3. **Push and Create PR**:

   ```bash
   git push origin feature/your-feature-name
   # Create PR via GitHub UI
   ```

4. **Automated Testing**:
   - Test suite runs automatically on PR creation
   - Multiple Node.js versions tested
   - Security audit performed
   - Code formatting and linting checked

5. **Review and Merge**:
   - Code review by team members
   - Merge to master after approval
   - Automatic deployment triggered

### Troubleshooting

1. **Build Fails**: Check the build logs in GitHub Actions or Render dashboard
2. **Tests Fail**: Review the test output in GitHub Actions
3. **App Won't Start**: Verify the start command and port configuration
4. **GitHub Actions Fail**: Ensure secrets are correctly configured
5. **Security Audit Fails**: Update vulnerable dependencies with `npm audit fix`

### Custom Domain (Optional)

1. In your Render service settings, go to "Custom Domains"
2. Add your domain name
3. Configure DNS records as instructed by Render

---

For more information, visit the [Render Documentation](https://render.com/docs).
