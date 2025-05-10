#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/un.h>
#include <sys/socket.h>

#define MAX 100

void main()
{
	int server_fd,client_fd;
	int server_len,client_len;
	char input[MAX];
	int i,count,len=0;

	struct sockaddr_un server_address,client_address;

	unlink("a2server");
	server_fd=socket(AF_UNIX,SOCK_STREAM,0);
	server_address.sun_family=AF_UNIX;
	strcpy(server_address.sun_path,"a2server");
	server_len=sizeof(server_address);
	bind(server_fd,(struct sockaddr *)&server_address,server_len);

	listen(server_fd,5);
	printf("Server Running\n\n");
	
	client_len=sizeof(client_address);
	client_fd=accept(server_fd,(struct sockaddr *)&client_address,&client_len);

	while(1)
	{
		printf("Waiting..\n");
		sleep(2);
		
		read(client_fd,input,MAX);
		printf("Server Received : %s\n",input);
		
		if(strcmp(input,"end")==0)
		{
			close(client_fd);
			//close(server_fd);
			break;
		}
		count=0;
		len=strlen(input);
		printf("%d\n",len);
		for(i=0;i<len;i++)
		{
			//printf("%c ",input[i]);
			if(input[i]=='1') 
				count+=1;
		}
		//printf("\n%d\n",count);
		if(count%2==0) input[i]='0';
		else input[i]='1';
		input[i+1]='\0';

		printf("Sending back to the client\n");
		write(client_fd,input,strlen(input)+1);
		//close(client_fd);

	}
	close(server_fd);
}
