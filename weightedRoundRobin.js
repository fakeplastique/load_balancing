

class WeightRoundRobinLoadBalancer {


    constructor(servers) {
        this.servers = servers.map(server =>({
            id: server.id,
            url: server.url,
            weight: server.weight,
            currentWeight: 0
        }));

        this.totalWeight = this.servers.reduce((sum, s) => sum + s.weight, 0);

    }

    getNextServer() {
        if (this.servers.length === 0) {
            throw new Error('No servers available');
        }

        for (const server of this.servers) {
            server.currentWeight += server.weight;
        }

        const selectedServer = this.servers.reduce((max, server) => 
            server.currentWeight > max.currentWeight ? server : max
        );

        selectedServer.currentWeight -= this.totalWeight;

        return selectedServer;

    }


}


const servers = [
    { id: 1, url: 'http://server1.com', weight: 3 },
    { id: 2, url: 'http://server2.com', weight: 2 },
    { id: 3, url: 'http://server3.com', weight: 1 }
];

const swrr = new WeightRoundRobinLoadBalancer(servers);
    
for (let i = 1; i <= 12; i++) {
    const server = swrr.getNextServer();
    console.log(`Request ${i} → Server ${server.id} (${server.url})`);
}
  