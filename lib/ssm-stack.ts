import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';


interface SsmStackProps extends StackProps {
  prj_name: string;
  vpc: ec2.Vpc;
}
export class SsmStack extends Stack {
  public readonly iam_role: iam.Role;

  constructor(scope: Construct, id: string, props: SsmStackProps) {
    super(scope, id, props);

    this.iam_role = new iam.Role(this, props.prj_name+'-'+this.constructor.name+'-iam_role_for_ssm', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentAdminPolicy'),
      ],
    });

    props.vpc.addInterfaceEndpoint(props.prj_name+'-'+this.constructor.name+'-InterfaceEndpoint_ssm', {
      service: ec2.InterfaceVpcEndpointAwsService.SSM,
    });
    props.vpc.addInterfaceEndpoint(props.prj_name+'-'+this.constructor.name+'-InterfaceEndpoint_ec2_messages', {
      service: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES,
    });
    props.vpc.addInterfaceEndpoint(props.prj_name+'-'+this.constructor.name+'-InterfaceEndpoint_ssm_messages', {
      service: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES,
    });

  }
}
