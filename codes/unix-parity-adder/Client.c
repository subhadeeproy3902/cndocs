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
	int sockfd,result,len;
	char input[MAX];

	struct sockaddr_un address;
	sockfd=socket(AF_UNIX,SOCK_STREAM,0);
	address.sun_family=AF_UNIX;
	strcpy(address.sun_path,"a2server");
	len=sizeof(address);

	printf("Client Running\n\n");

	result=connect(sockfd,(struct sockaddr *)&address,len);
	if(result==-1)
	{
		printf("Cannot connect to server\n");
		exit(1);
	}
	
	while(1)
	{
		printf("Enter the bit-stream : ");
		scanf("%[^\n]",input);
		getchar();
		
		printf("\nSending %s to the server\n",input);
		write(sockfd,input,strlen(input)+1);

		if(strcmp(input,"end")==0)
		{
			//close(sockfd);
			break;
		}

		printf("Waiting for the server\n");
		sleep(1);
		read(sockfd,input,MAX);
		printf("Received from the server with parity bit : %s\n\n",input);
	}
	close(sockfd);
}