class LeastConnectionLoadBalance {

    constructor(servers) {
        this.servers = servers.map(server => ({
            ...server,
            connections: 0
        }));

    }

    getNextServer() {
         if (this.servers.length === 0) {
            throw new Error('No servers available');
        }

        let minConnections = Infinity;
        let selectedServers = [];

        for (const server of this.servers) {
            if (server.connections < minConnections) {
                minConnections = server.connections;
                selectedServers = [server];
            } else if (server.connections === minConnections) {
                selectedServers.push(server);
            }
        }

        const selected = selectedServers[Math.floor(Math.random() * selectedServers.length)];

        selected.connections++;

        return selected;
        
    }

    releaseConnection(server) {
        const serverIdx = this.servers.findIndex(s => s.id === server.id);
        if (serverIdx !== -1 && this.servers[serverIdx].connections > 0) {
            this.servers[serverIdx].connections--;
        }
    }

}


const servers = [
  { id: 1, url: 'http://server1.com' },
  { id: 2, url: 'http://server2.com' },
  { id: 3, url: 'http://server3.com' }
];


const loadBalancer = new LeastConnectionLoadBalance(servers);

const handleRequest = async (requestId) => {
    const server = loadBalancer.getNextServer();
    console.log(`Request ${requestId} → Server ${server.id} (${server.url})`);
    setTimeout(() => {
        console.log(`Releasing request ${requestId}.`)
        loadBalancer.releaseConnection(server)
    }, 
        Math.floor(Math.random() * 1000)
    );
}


const requests = Array.from({ length: 10 }, (_, i) => handleRequest(i));
await Promise.all(requests);
