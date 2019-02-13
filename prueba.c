#include <stdio.h>

int primo(int a){
	int r = 1;
	while(r*r <= a)
		r++;
	printf("hahahehaehahehaebryanhea\n");
	r--;
	printf("acabe while\n");
	for(int i = 2; i <= r; i++)
		if(a%i == 0)
			return 0;
	printf("%d\n", r);
	return 1;
}

int hola(int);

int main(int argc, char const *argv[]){
	printf("Hola\n");

	printf("HOla 2_ BRYAN\n");
	printf("hahaha\n");
	printf("HOla 2\n");

	printf("hola4\n");
	printf("hola 5\n");

	printf("hola 6\n");
	printf("hola 7\n");
	return 0;
}

int hola(int a){
	printf("%d\n",a);
}

int hola2(){
	printf("hahaha\n");
}