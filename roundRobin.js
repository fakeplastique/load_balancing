class RoundRobinLoadBalancer {

    constructor(servers) {
        this.servers = servers;
        this.currentIdx = 0;
    }

    getNextServer() {

        if (this.servers.length === 0) {
            throw new Error('No servers available');
        }

        const server = this.servers[this.currentIdx];

        this.currentIdx = (this.currentIdx + 1) % this.servers.length;

        return server;
    }

    addServer(server) {
        this.servers.push(server);
    }

    removeServer(server) {
        const index = this.servers.indexOf(server);
        if (index > -1) {
            this.servers.splice(index, 1);
        }

        if (this.currentIdx >= this.servers.length) {
            this.currentIdx = 0;
        }
    }

}

const servers = [
  { id: 1, url: 'http://server1.com' },
  { id: 2, url: 'http://server2.com' },
  { id: 3, url: 'http://server3.com' }
];

const loadBalancer = new RoundRobinLoadBalancer(servers);

for (let i = 1; i <= 10; i++) {
  const server = loadBalancer.getNextServer();
  console.log(`Request ${i} → Server ${server.id} (${server.url})`);
}