---
title: "How Portsicle works!"
subtitle: "Exposing local servers to public network."
date: "2025-03-02"
tags: ["golang", "tunneling", "portsicle"]
---

### What is Portsicle?

[Portsicle](https://portsicle.github.io/landing-page) is a reverse tunneling service that creates a public ingress endpoint for local servers, allowing developers to showcase their locally running applications to clients, stakeholders or to test APIs without deploying.

---

### And how does it work?

We all know that the most obvious way to allow an inbound traffic to a private network is through port forwarding, right? But we won't sit and configure our routers every time! we need a better solution.

But if we're not forwarding the port, then how can an external packet enter our private network without getting chocked by firewalls?

Here's where the concept of [Reverse Tunneling](https://qbee.io/misc/reverse-ssh-tunneling-the-ultimate-guide/) comes into the picture. Reverse Tunneling is a technique used to establish a secure connection from a remote server back to a local machine. Portsicle beautifully manipulates this same technique to route traffic to local machine.

The idea is to have an intermediary remote (relay) server which will act as a bridge between local machine and the internet traffic. Anyone who wants to access someone's local server, will first visit to the remote server, which will then route the request to the local machine.

![HIGH LEVEL ARCHITECTURE](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/irornujvorut3x6d6y4u.png)

To achieve this, Portsicle provides a client CLI which connects to the remote server. The user can use the CLI command to initiate the tunnel. This means that the connection is now outbound (established by the local machine) and the firewall will just ignore it. This connection is then upgraded to a secure and persistent websocket tunnel.

![secure tunnel](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6l70p7agm9ocn9qlq8zq.png)

Once a tunnel is established, the relay server provides a 'Public URL' for that session. Anyone on the internet can now access that particular local server with this public URL and the URL is only valid as long as the client is running along.

Steps to get the public url:

- Run the client:

```
portsicle http -p 3000
```

> note that 3000 has to be the port of the local server you wanted to expose.

- You'll then receive the URL:

```
❯ ./portsicle http -p 3000
2025/02/23 00:26:33 Connected to remote server.
2025/02/23 00:26:33 Your public url: https://portsicle.koyeb.app/a355bf62-f7c4-46e9-9d9b-1125d6343b3d
```

Your local server is accessible with this link!

---

But how the traffic is "forwarded"??? Well, we simply convert the HTTP/HTTPS requests and responses into websocket messages and forward them between local client and the remote server.

We handle this forwarding for two cycles:

- Request cycle:

Take plain HTTP request => Convert it to a message object => send it across wire => reconstruct an HTTP request => send it to local server.

![Request cycle](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zf3ixzzkgb4eogjcmlb0.png)

- Response cycle:

Client gets a response from local server => convert it to a response object => send it across wire => construct a response.

![Response cycle](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a6vac6h1wq1xmktqz1is.png)
