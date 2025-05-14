#include <sys/socket.h>
#include <sys/types.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#define MAX 100

// Bit stuffing function for better understanding

char *bit_stuffing(char *input) {
	char *output = (char*)malloc(MAX*sizeof(char));
	int i, j=0, count = 0;
	int flag = 0;
	for(i=0; i<strlen(input); i++) {   
		output[j++] = input[i];
		if(input[i] == '1') {
			count++;
			if(count == 5 && flag) {
				output[j++] = '0';
				count = 0;
				flag = 0;
			}
		} else {
			count = 0;
			flag = 1;
		}
		
	}
	output[j] = '\0';
	return output;
}