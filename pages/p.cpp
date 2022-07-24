#include <bits/stdc++.h>
using namespace std;
int countTriplets(int a[],int b[],int c[], int n){
   int count = 0;
   for (int i = 0; i < n; i++){
      for (int j = 0; j < n; j++){
         for (int k = 0; k < n; k++){
            if(a[i]<b[j] && b[j]<c[k])
               { count++; }
         }
      }
   }
   return count;
}
int main(){
   int A[]={ 1,2,3}; int B[]={ 2,3,2}; int C[]={ 4,3,1};
   int N=3; //length of array
   cout <<endl<< "Number of triplets : "<<countTriplets(A,B,C,N);
   return 0;
}