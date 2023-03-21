#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkTemplateStack } from '../lib/aws-cdk-template-stack';
import { VpcStack } from '../lib/vpc-stack';
import { SsmStack } from '../lib/ssm-stack';
import { Ec2Stack } from '../lib/ec2-stack';


const app = new cdk.App();

const prj_name = 'AwsCdkTemplate';
const env = {
  account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
}

new AwsCdkTemplateStack(app, 'AwsCdkTemplateStack', {});

const vpc_stack = new VpcStack(app, prj_name+'-VpcStack', {
  prj_name: prj_name,
  env: env,
});

const ssm_stack = new SsmStack(app, prj_name+'-SsmStack', {
  prj_name: prj_name,
  env: env,
  vpc: vpc_stack.vpc,
});

const ec2_stack = new Ec2Stack(app, prj_name+'-Ec2Stack', {
  prj_name: prj_name,
  env: env,
  vpc: vpc_stack.vpc,
  ec2_sg: vpc_stack.ec2_sg,
  ssm_iam_role: ssm_stack.iam_role,
});
