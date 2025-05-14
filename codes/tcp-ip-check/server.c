#include "custom.h"

pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
int active_clients = 0;

typedef struct {
	int client_fd;
	int client_no;
	int server_fd;
} client_data;

void* pthBody(void* args) {
	client_data* data = (client_data*)args;
	int client_fd = data->client_fd;
	int client_no = data->client_no;
	int server_fd = data->server_fd;
	free(data); // Free the malloc'd data

	char buff[MAX];
	struct sockaddr_in sa;
	while (1) {
		int m = read(client_fd, buff, sizeof(buff));
		buff[m] = '\0';
		printf("Address received from Client %d : %s\n", client_no, buff);

		if (!strncmp(buff, "exit", 4)) break;
		
		if(inet_pton(AF_INET,buff,&(sa.sin_addr))!=0) strcpy(buff, "YES");
		else strcpy(buff,"NO");
		write(client_fd, buff, strlen(buff));
	}
	close(client_fd);

	pthread_mutex_lock(&lock);
	active_clients--;
	if (active_clients == 0) {
		printf("All clients exited. Server shutting down.\n");
		close(server_fd);
		exit(0);
	}
	pthread_mutex_unlock(&lock);

	return NULL;
}

int main() {
	int server_fd = socket(AF_INET, SOCK_STREAM, 0);
	struct sockaddr_in server_addr, client_addr;

	server_addr.sin_family = AF_INET;
	server_addr.sin_port = htons(PORT_NO);
	server_addr.sin_addr.s_addr = inet_addr(ip);

	int server_len = sizeof(server_addr);
	int client_len = sizeof(client_addr);

	bind(server_fd, (struct sockaddr*)&server_addr, server_len);
	listen(server_fd, 5);

	int client_no = 0;

	while (1) {
		int client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);

		pthread_t th;

		client_data* data = (client_data*)malloc(sizeof(client_data));
		data->client_fd = client_fd;
		data->client_no = client_no;
		data->server_fd = server_fd;

		pthread_mutex_lock(&lock);
		active_clients++;
		pthread_mutex_unlock(&lock);

		pthread_create(&th, NULL, pthBody, data);
		pthread_detach(th);  // Detach to reclaim memory automatically

		printf("Created Thread for Client %d\n", client_no++);
	}
}  