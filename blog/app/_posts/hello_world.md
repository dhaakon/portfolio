{{{
    "title"    : "Hello, World",
    "tags"     : [ "Commentary" ],
    "author"   : "David Poyner",
    "category" : "Social",
    "date"        : "07-27-2013",
    "image"    : "./images/hello-world.jpg",
    "references"  : [],
    "preview"     : "First blog post testing out poet and node.js"

}}}

Introduction
-----

This is going to be my first tutorial of many. I am assuming that you
are rather familiar in using the Terminal, node.js, and express.js.

I'm going to jump right into it. Building a simple blog using a node.js
server. I'm going to use [AWS](http://www.amazon.com/aws/) to host and
run my node server.

AWS Elastic Beanstalk
-----
I recently discovered the wonders to a deployment service from Amazon
called Elastic Beanstalk.

What is Elastic Beanstalk
-----

In short, it is a service that hooks up a git repo to a deployment
service.

A more in-depth summary can be found [here]()

> AWS Elastic Beanstalk is an even easier way for you to quickly deploy and manage applications in the AWS cloud. You simply upload your application, and Elastic Beanstalk automatically handles the deployment details of capacity provisioning, load balancing, auto-scaling, and application health monitoring. At the same time, with Elastic Beanstalk, you retain full control over the AWS resources powering your application and can access the underlying resources at any time. Elastic Beanstalk leverages AWS services such as Amazon Elastic Cloud Compute (Amazon EC2), Amazon Simple Storage Service (Amazon S3), Amazon Simple Notification Service (Amazon SNS), Elastic Load Balancing, and Auto Scaling to deliver the same highly reliable, scalable, and cost-effective infrastructure that hundreds of thousands of businesses depend on today. AWS Elastic Beanstalk is easy to begin and impossible to outgrow.
