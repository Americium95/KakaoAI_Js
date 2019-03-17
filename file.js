/*마르코프체인 기반 학습챗봇
Copyright (C) 2019년 <Americium sunk0525@naver.com>
이 프로그램은 자유 소프트웨어입니다. 소프트웨어의 피양도자는 자유 소프트웨어 재단이 공표한 GNU 일반 공중 사용 허가서 2판 또는 그 이후 판을 임의로 선택해서, 그 규정에 따라 프로그램을 개작하거나 재배포할 수 있습니다.

이 프로그램은 유용하게 사용될 수 있으리라는 희망에서 배포되고 있지만, 특정한 목적에 맞는 적합성 여부나 판매용으로 사용할 수 있으리라는 묵시적인 보증을 포함한 어떠한 형태의 보증도 제공하지 않습니다. 보다 자세한 사항에 대해서는 GNU 일반 공중 사용 허가서를 참고하시기 바랍니다.

GNU 일반 공중 사용 허가서는 이 프로그램과 함께 제공됩니다. 만약, 이 문서가 누락되어 있다면 자유 소프트웨어 재단으로 문의하시기 바랍니다. (자유 소프트웨어 재단: Free Software Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA)*/


var L="\n \n Gnomovision version 69, Copyright (C) 2019년 <Americium sunk0525@naver.com>\nGnomovision 프로그램에는 제품에 대한 어떠한 형태의 보증도 제공되지 않습니다. 보다 자세한 사항은 #Ich☆liebe☆dich# 명령어를 실행해서 참고할 수 있습니다. 이 프로그램은 자유 소프트웨어입니다. 이 프로그램은 배포 규정을 만족시키는 조건하에서 자유롭게 재배포될 수 있습니다. 배포에 대한 규정들은 #Ich☆liebe☆dich# 명령어를 통해서 참고할 수 있습니다.";

var ReturnPointList=[];
var ReturnList=[];
var ChainCounter=0;
var RoomList=[];
var RoomMsgList=[];

var SendParMsg=0;
var SendMsgCount=0;
var MsgCount=0;

function response(room, msg, sender, isGroupChat, replier)
{
   if(msg=="#Ich☆liebe☆dich#")
   {
   replier.reply("정보\n반응률:"+(1-(SendParMsg))*100+"\n누적출력:"+SendMsgCount+L);
   
   return null;
   }

   MsgCount++;
  SendParMsg=SendMsgCount/MsgCount;

   if(Math.random()*1.5<=(1-(SendParMsg)))
   {
      str=Active(msg,room);
      if(str!="")
      {
         SendMsgCount++;
         send(str,replier);
      }
   }
   
}



//처리
Active=(str,room)=>{
   str=str.replace(/  +/g," ");
   if(isOnlyKorean(str))
   {
      if(RoomList.indexOf(room)==-1)
      {
         RoomList.push(room);
         RoomMsgList.push(str);
      }else{
         Data=RoomMsgList[RoomList.indexOf(room)];
         if(Data.length>1001)
         {
	   RoomMsgList[RoomList.indexOf(room)]=Data.substring(Data.length-1000)+" "+str;
         }
         else{
         RoomMsgList[RoomList.indexOf(room)]=Data+" "+str;
         }
      }

      
      WordSplitChain(str);
      ChainMake(str);
      return Check(room,str);
   }
}

/*문자열을 나눈후
체인배열 생성 함수로 전달*/
WordSplitChain=(str)=>{
   ReturnList=[];
   ReturnPointList=[];
   ChainCounter=0;
   var WordList=str.split(" ");
   for(var i=0;i<WordList.length;i++){
      MakeChainWords(WordList[i],"",0);
   }
}

//체인을 응용한 리스트 생성
MakeChainWords=(Word,Words,Point)=>{
      if(Words!="")
      {
         ReturnList.push(Words+" "+Word);
         ReturnPointList.push(Point);
      }
   if(ChainCounter<=40)
   {
      ChainCounter++;
      var ChainWordList=UseChain(Word);
   if(ChainWordList!=null)
   {
         for(var i_0=0;i_0<ChainWordList.length;i_0++)
         {
             if(Math.random()>0.5)
             {
            MakeChainWords(ChainWordList[i_0][0],Words+" "+Word,Point+ChainWordList[i_0][1]);

MakeChainWords(ChainWordList[i_0][0],"",Point+ChainWordList[i_0][1]);
            }else
             {
           MakeChainWords(ChainWordList[i_0][0],"",Point+ChainWordList[i_0][1]); MakeChainWords(ChainWordList[i_0][0],Words+" "+Word,Point+ChainWordList[i_0][1]);
            }

         }
      }
   }
}

//체인생성
UseChain=(Word)=>{
WordListRetun=[[]];

var dir=new java.io.File("sdcard/BotDate/ReadDate/"+Word);

WordList=dir.list();
if(WordList!=null)
   for(var i=0;i<WordList.length;i++)
   {
   WordListRetun[i][0]=WordList[i];   WordListRetun[i][1]=ReadFile("sdcard/BotDate/ReadDate/"+Word+"/"+WordList);
return WordListRetun;
   }
return null;
}

//최다 득점 문장 선별
Check=(room,str)=>{
   var MaxPointStr="";
   var MaxPoint=0;
   for(var i=0;i<ReturnList.length;i++)
   {
      ThisPoint=ANB(RoomMsgList[RoomList.indexOf(room)],ReturnList[i])/(ReturnList[i].split(" ").length*2)+ReturnPointList[i]/ReturnList[i].split(" ").length;
      if(ANB(ReturnList[i],str)<0.8&&ThisPoint>MaxPoint)
      {
         MaxPoint=ThisPoint;
         MaxPointStr=ReturnList[i];
      }
   }
   return MaxPointStr;
}

//체인 생성
ChainMake=(str)=>{
Data=str.split(" ");
   //if(Data.length>1)
   {
   for(var i=0;i<Data.length-1;i++)
   {
      if(!new java.io.File("sdcard/BotDate/ReadDate/"+Data[i]+"/"+Data[i+1]).exists())
      {
         new java.io.File("sdcard/BotDate/ReadDate/"+Data[i]).mkdirs();
      saveFile("sdcard/BotDate/ReadDate/"+Data[i]+"/"+Data[i+1],0);
      }else{
          saveFile("sdcard/BotDate/ReadDate/"+Data[i]+"/"+Data[i+1],ReadFile("sdcard/BotDate/ReadDate/"+Data[i]+"/"+Data[i+1])+1);
      }
   }
   }
}



/*문자열 A와B의 유사도 검사*/
ANB=(A,B)=>{
   var N=0;
   var AAR=A.split(" ");
   var BAR=B.split(" ");
   var RAR=[];
   var RAR_2=[];
   for(var i=0;i<AAR.length;i++)
   {
      
      for(var i_2=0;i_2<BAR.length;i_2++)
       {
         if(RAR.indexOf(AAR[i])==-1)
          {
             RAR.push(AAR[i]);
             RAR_2.push(0);
          }else{
             RAR_2[RAR.indexOf(AAR[i])]++;
          }
            
          if(BAR[i_2]==AAR[i])
          {
            
             N++;
          }
       }
   }
   
   for(var i=0;i<BAR.length;i++)
   {
       if(RAR.indexOf(BAR[i])==-1)
      {
          RAR.push(BAR[i]);
         RAR_2.push(0);
      }else{
         RAR_2[RAR.indexOf(BAR[i])]++;
      }
   }
   
   return N/Math.max(AAR.length,BAR.length)*100;
}

//한글 체크
isOnlyKorean=(str)=>{
   for(var i=0;i<str.length;i++)
   {
      let charCode=str.charAt(i).charCodeAt(0);
         if(!(charCode==32||(charCode>=44032&&charCode<=55203)||(charCode<=12622&&charCode>=12593)))
          return false;
   }
   return true;
}

send=(str,replier)=>{
   if((str+"")!=""&&str!=null)
   {
	   new java.lang.Thread.sleep(str.length*200);
        replier.reply(str);
   }
}


//파일 읽기
ReadFile=(path)=>{
   try{
   var file = new java.io.File(path);
   if(!(file.exists()))
   return null;
   var fis = new java.io.FileInputStream(file);
   var isr = new java.io.InputStreamReader(fis);
   var br = new java.io.BufferedReader(isr);
   var s = br.readLine();
   var read = "";
   while((read = br.readLine()) != null) s += "" + read;
   fis.close();
   isr.close();
   br.close();
   return s;
   }catch(error) {
   //print("error : " + error);
   }
}

//파일 작성
saveFile=(path,content)=>{
   try
   {
   var file = new java.io.File(path);
      var fw = new java.io.FileWriter(file,false);
      var bw = new java.io.BufferedWriter(fw);
      var str = new java.lang.String(content);
      bw.write(str);
      bw.close();
      fw.close();
   }catch(e){

   }
}
