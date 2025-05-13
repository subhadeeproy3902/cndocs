#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/un.h>
#include <sys/socket.h>
#include <math.h>

#define MAX 100

struct message
{
	char word[MAX];
	char divisor[MAX];
};

char cw[MAX],rm[MAX];
void toBin(long long int num, char *bin)
{
    int i = 0;
    while (num) {
        if (num & 1)
            bin[i++] = '1';
        else
            bin[i++] = '0';
        num = num >> 1;
    }
    bin[i] = '\0';

    int j = 0, k = i - 1;
    while (j < k) {
        char temp = bin[j];
        bin[j] = bin[k];
        bin[k] = temp;
        j++;
        k--;
    }
}

long long int toDec(const char *bin)
{
    long long int num = 0;
    int len = strlen(bin);
    for (int i = 0; i < len; i++) {
        if (bin[i] == '1')
            num += 1 << (len - i - 1);
    }
    return num;
}

void CRC(const char *dataword, const char *generator)
{
    int l_gen = strlen(generator);
    long long int gen = toDec(generator);

    long long int dword = toDec(dataword);

    long long int dividend = dword << (l_gen - 1);

    int shft = (int)(ceil(log2(dividend + 1)) - l_gen);
    long long int rem;

    while ((dividend >= gen) || (shft >= 0)) {
        rem = (dividend >> shft) ^ gen;
        dividend = (dividend & ((1LL << shft) - 1)) | (rem << shft);
        shft = (int)(ceil(log2(dividend + 1)) - l_gen);
    }

    long long int codeword = (dword << (l_gen - 1)) | dividend;
    char bin_dividend[100], bin_codeword[100];
    toBin(codeword, bin_codeword);
    strcpy(bin_dividend,bin_codeword+strlen(dataword));
    printf("Remainder: %s\n", bin_dividend);
    printf("Codeword : %s\n", bin_codeword);
    strcpy(cw,bin_codeword);
    strcpy(rm,bin_dividend);
}

void main()
{
	int server_fd,client_fd;
	int server_len,client_len;
	struct sockaddr_un server_address,client_address;
	struct message data;
	
	unlink("server");
	server_fd=socket(AF_UNIX,SOCK_STREAM,0);
	server_address.sun_family=AF_UNIX;
	strcpy(server_address.sun_path,"server");
	server_len=sizeof(server_address);
	bind(server_fd,(struct sockaddr *)&server_address,server_len);
	
	listen(server_fd,5);
	printf("Server Running\n\n");

	client_len=sizeof(client_address);
	client_fd=accept(server_fd,(struct sockaddr *)&client_address,&client_len);

	while(1)
	{
		printf("Waiting..\n");
		sleep(1);
		read(client_fd,(void *)&data,sizeof(data));
		printf("Server received from client\n");
		if(strcmp(data.word,"end")==0)
		{
			close(client_fd);
			break;
		}
		else
		{
			printf("Data word : %s\n",data.word);
			printf("Divisor : %s\n",data.divisor);
		}
		
		CRC(data.word,data.divisor);
		
		strcpy(data.word,cw);
		strcpy(data.divisor,rm);

		printf("Sending back codeword : %s\n",data.word);
		printf("Sending back remainder : %s\n",data.divisor);

		write(client_fd,(void *)&data,sizeof(data));
	}
	close(server_fd);
}
