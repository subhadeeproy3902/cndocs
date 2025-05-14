#include "custom.h"

int main(int ac,char **av) {
	struct sockaddr_in saddr,caddr;
	char sip_addr[MAX],bit[MAX],ans[MAX];
	if (ac==1) {
		strcpy(sip_addr,"127.0.0.1");
	}
	else {
		strcpy(sip_addr,av[1]);
	}
	int sid=socket(AF_INET,SOCK_STREAM,0);
	saddr.sin_family=AF_INET;
	saddr.sin_addr.s_addr=inet_addr(sip_addr);
	inet_aton(sip_addr,&(saddr.sin_addr));
	saddr.sin_port=htons(1234);
	int res=connect(sid,(struct sockaddr*)&saddr,sizeof(saddr));
	if (res==-1) {
		printf("CANNOT Connect to the Server...\n");
		close(sid);
		exit(1);
	}
	while (1) {
		printf("Enter a BIT STREAM: ");
		scanf("%s",bit);
		getchar();
		if (strlen(bit)>32) {
			printf("Input Should be 32 bits...");
			continue;
		}
		write(sid,(void*)&bit,strlen(bit)+1);
		if (strcmp(bit,"end")==0) {
			printf("Client Terminated...\n");
			break;
		}
		printf("\nClient Sent %s to the Server\n",bit);
		read(sid,ans,MAX);
		printf("Bit Stuffed Result RECEIVED from the Server: %s\n\n",ans);
	}
	close(sid);
	return 0;
}