#include "custom.h"

int main(int ac,char **av) {
	struct sockaddr_in saddr,caddr;
	char sip_addr[MAX],bit[MAX];
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
	int res=bind(sid,(struct sockaddr*)&saddr,sizeof(saddr));
	if (res==-1) {
		printf("SERVER CANNOT START...\n");
		close(sid);
		exit(1);
	}
	listen(sid,5);
	int len=sizeof(caddr);
	int cid=accept(sid,(struct sockaddr *)&caddr,&len);
	while (1) {
		read(cid,(void*)&bit,MAX);
		if (strcmp(bit,"end")==0) {
			printf("OOPS SERVER TERMINATED\n");
			break;
		}
		printf("SERVER RECEIVED %s FROM THE CLIENT...\n",bit);
		int count=0;
		int i;
		for (i=0;i<strlen(bit);i++) {
			if (bit[i]=='1') {
				count++;
			} 
			if (bit[i]=='0') {
				count=0;
			} 
			if (count==5) {
				int j;
				char prev='0',curr;
				for (j=i+1;j<strlen(bit);j++) {
					int curr=bit[j];
					bit[j]=prev;
					prev=curr;
				}
				bit[j]=prev;
				bit[j+1]='\0';
			}
		}
		write(cid,(void*)&bit,strlen(bit)+1);
		printf("SERVER SENT %s TO THE CLIENT\n\n",bit);
	}
		close(sid);
		close(cid);
		return 0;
}	