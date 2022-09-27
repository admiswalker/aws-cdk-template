#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkTemplateStack } from '../lib/aws-cdk-template-stack';
import { VpcStack } from '../lib/vpc-stack';
import { SsmStack } from '../lib/ssm-stack';
import { Ec2Stack } from '../lib/ec2-stack';


const prj_name = 'AwsCdkTemplate';

const app = new cdk.App();

new AwsCdkTemplateStack(app, 'AwsCdkTemplateStack', {});

const vpc_stack = new VpcStack(app, prj_name+'-VpcStack', {
  prj_name: prj_name
});

const ssm_stack = new SsmStack(app, prj_name+'-SsmStack', {
  prj_name: prj_name,
  vpc: vpc_stack.vpc,
});

const ec2 = new Ec2Stack(app, prj_name+'-Ec2Stack', {
  prj_name: prj_name,
  vpc: vpc_stack.vpc,
  ssm_iam_role: ssm_stack.iam_role,
});
