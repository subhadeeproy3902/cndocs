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

struct message
{
	char word[MAX];
	char divisor[MAX];
};

void main()
{
	int sockfd,result,len;
	struct message data;
	
	struct sockaddr_un address;
	sockfd=socket(AF_UNIX,SOCK_STREAM,0);
	address.sun_family=AF_UNIX;
	strcpy(address.sun_path,"server");
	len=sizeof(address);

	printf("Client Running\n\n");

	result=connect(sockfd,(struct sockaddr *)&address,len);
	if(result == -1)
	{
		printf("Cannot connect to the server\n");
		exit(1);
	}

	while(1)
	{
		printf("Enter the data word : ");
		scanf("%[^\n]",data.word);
		getchar();
		printf("Enter the divisor : ");
		scanf("%[^\n]",data.divisor);
		getchar();

		printf("Sending data to the server \n");
		if(strcmp(data.word,"end")==0)
		{
			write(sockfd,(void *)&data,sizeof(data));
			break;
		}
		else
		{
			write(sockfd,(void *)&data,sizeof(data));
		}
		
		printf("Waiting for the server\n");
		sleep(1);
		read(sockfd,(void *)&data,sizeof(data));
		printf("Received from the server (Codeword) : %s\n\n",data.word);
		printf("Received from the server (Remainder) : %s\n\n",data.divisor);
	}
	close(sockfd);
}
