import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { InstanceType, NatInstanceImage, NatProvider } from 'aws-cdk-lib/aws-ec2';


interface VpcStackProps extends StackProps {
    prj_name: string;
}
export class VpcStack extends Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, props.prj_name+'-'+this.constructor.name+'-vpc_for_ec2_and_ssm', {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      natGatewayProvider: ec2.NatProvider.instance({
        instanceType: new InstanceType('t3a.nano'),
        machineImage: new NatInstanceImage(),
      }),
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

  }
}