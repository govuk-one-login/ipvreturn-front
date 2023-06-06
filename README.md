# di-ipvreturn-front

## Deployment in own stack in DEV

To deploy a copy of the frontend infra from a local branch as a separate isolated stack in DEV:

- update the `Image:` tag in template.yaml to point to the container image to be deployed - this can be found by looking in ECR in the AWS Console for the latest image and tag.
- the run:

```shell
sam build --parallel --no-cached
sam deploy --resolve-s3 --stack-name "CUSTOM_STACK_NAME" --capabilities CAPABILITY_IAM --confirm-changeset --parameter-overrides \
"Environment=\"dev\" PermissionsBoundary=\"none\" VpcStackName=\"vpc-cri\" EnableScalingInDev=0"
```

Note the following parameters can be used to specify whether or not to deploy the autoscaling infra:

- `EnableScalingInDev` default to 0 which inhibits deployment of scaling infra in dev; set to 1 to deploy scaling infra
- `MinContainerCount` default is 3
- `MaxContainerCount` default is 12

## Create and upload a custom image to ECR

Execute the following commands to create a custom image locally and push it up to ECR.
You need to have AWS credentials in your shell via `aws-vault` or `gds-cli` or similar.
`YOUR_REPO` needs to refer to an existing repo in ECR, you can create one in console if you don't have one already.

```shell
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 489145412748.dkr.ecr.eu-west-2.amazonaws.com
docker build -t di-ipvreturn-front-dev .
docker tag di-ipvreturn-front-dev:latest 489145412748.dkr.ecr.eu-west-2.amazonaws.com/YOUR_REPO:YOUR_TAG
docker images
docker push 489145412748.dkr.ecr.eu-west-2.amazonaws.com/YOUR_REPO:YOUR_TAG
```

Then to use this new image update the `Image:` tag in the template.yaml and redeploy your template locally in to your own stack in DEV.