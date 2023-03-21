import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { InstanceType, NatInstanceImage, NatProvider } from 'aws-cdk-lib/aws-ec2';


interface VpcStackProps extends StackProps {
    prj_name: string;
}
export class VpcStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly ec2_sg: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

      const nat_instance:ec2.NatInstanceProvider = ec2.NatProvider.instance({
        instanceType: new InstanceType('t3a.nano'),
        machineImage: new NatInstanceImage(),
        defaultAllowedTraffic: ec2.NatTrafficDirection.OUTBOUND_ONLY,
      });

      this.vpc = new ec2.Vpc(this, props.prj_name+'-'+this.constructor.name+'-vpc_for_ec2_and_ssm', {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      natGatewayProvider: nat_instance,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 27,
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 27,
        },
      ],
    });

    this.ec2_sg = new ec2.SecurityGroup(this, 'Ec2Sg', {
      allowAllOutbound: true,
      securityGroupName: 'EC2 Sev Security Group',
      vpc: this.vpc,
    });

    nat_instance.connections.allowFrom(this.ec2_sg, ec2.Port.allTraffic());
    
    //---
  }
}