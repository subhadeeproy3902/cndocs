#include "custom.h"

void main() {
	char buffer[MAX];
	struct sockaddr_in client_addr;

	client_addr.sin_family = AF_INET;
	client_addr.sin_port = htons(PORT_NO);
	client_addr.sin_addr.s_addr = inet_addr(ip);	

	int client_fd = socket(AF_INET, SOCK_STREAM, 0);
	int client_len = sizeof(client_addr);
	connect(client_fd, (struct sockaddr*)&client_addr, client_len);

	while (1) {
		printf("Enter the IPv4 address (or 'exit' to quit): ");
		scanf(" %s", buffer);

		// Send to server
		write(client_fd, buffer, strlen(buffer));

		// Break loop if client says END
		if (strncmp(buffer, "exit", 4) == 0) break;

		// Read server response
		
		int m = read(client_fd, buffer, sizeof(buffer));
		buffer[m] = '\0';
		printf("Result: %s\n", buffer);
		memset(buffer, 0, sizeof(buffer));
	}

	close(client_fd);
}