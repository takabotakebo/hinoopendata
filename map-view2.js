

// S1  
//Json取得に関するscript############################################################################## //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//

        //数値の初期設定
        var apiKey = 'AIzaSyDV-W1Zg9_wGJPww-NT5tz9Wi78QF-sDuM';
        var tableId = '1Z5wytXgqUl5bbkXf_QOradh4QAEICkBXu1HEa_s_';
        var dataArray = {};
        var all_iventData = {};
        
        var geocode_dataArray = {};
        var geocode_iventData = {};
        
        var geocoded_marker_location = [];
        
        
        //フージョンテーブルズから取ってくる情報の初期化
        function initialize(){
            
            //urlにAPIキーとsql文をくっつけてる
            var sql = 'SELECT * FROM ' + tableId ;      //+ " WHERE week = '" + selected_date + "' ";にするとJSON自体にフィルターをかけれる
            var url = 'https://www.googleapis.com/fusiontables/v1/query';
            url += '?key=' + apiKey;
            url += '&sql=' + encodeURIComponent(sql);
            
            
            //JSON形式でFusionTablesからデータ取得
            //グローバル変数 dataArrayに中身の文字列をStringに変換してからObject型で格納
            //dataArrayからキー指定して all_iventDataに取得してきたrows(イベント情報)のobjictを生成
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    dataArray = JSON.parse(JSON.stringify(data));
                    console.log(dataArray["rows"]);     //dataArrayに格納できているかの確認
                    
                    all_iventData = dataArray["rows"];
                    
                },
                error: function( data ) {
                        $( '#sample-result' ).html( '<font color="red">読み込みNG(ChromeではNG)</font>' );
                }
            });
            
            
            $.getJSON("jsons/kodomo.json", function(data){
	             geocode_dataArray = JSON.parse(JSON.stringify(data)); 
                console.log(geocode_dataArray[0]);     //geocode_dataArrayに格納できているかの確認
            });
            
        }
        











// S2 
//地図表示に関するscript文################################################# //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
        
        //メインのマップに名前をつける
        var main_mapview;
        
        //地図自体の表示
        function initMap() {
            
            // キャンパスの要素を取得する
            var canvas = document.getElementById( 'map-canvas' ) ;
            
            // 中心の位置座標を指定する
            var lating = new google.maps.LatLng( 35.661278, 139.395139 );

            //スタイル情報を配列に保存
            var style01 = [
              {
                stylers: [
                    { hue: "#b4cb9e" },
                    { saturation: -20 },
                    { lightness: 20 },
                    { gamma: 1.51 }
                ]
              },{
                featureType: "road",
                elementType: "geometry",
                stylers: [
                  { lightness: 100 },
                  { visibility: "simplified" }
                ]
              },{
                featureType: "road",
                elementType: "labels",
                stylers: [
                  { visibility: "off" }
                ]
              },{
                  featureType: "poi.government",
                  elementType: "labels",
                  stylers: [
                    { visibility: "off" }
                  ]
              }
            ];
            // 地図のオプションを設定する
            var mapOptions = {
                zoom: 12 ,				// ズーム値
                center: lating ,		// 中心座標 [lating]
                styles: style01,        //地図のスタイル適用
                disableDefaultUI: true　//デフォルトUIをオフ
            };

            // [canvas]に、[mapOptions]の内容の、地図のインスタンス([map])を作成する
            var map = new google.maps.Map( canvas , mapOptions ) ;
            
            //このfunction外でも使うためにmain_mapviewにmapを格納
            main_mapview = map ; 
        }
        
        
        
        
        //マーカーの設定
        var marker = []; //インスタンス化のための変数
        //出ているマーカーの個数をカウントする変数
        var marker_amount = 0;
        
        var ivent = [];

        
        //マーカーの表示
        function initMarker(sel){
            
            
            //ユーザーが選択した日付の取得(id="form1"のoptionのvalue値を取得)
            //変数名をgenreに変更し、取得したジャンルを格納#################
            //########################################################
            //########################################################
            //########################################################
            var selected_genre;
            selected_genre = get_genre;
            //console.log(selected_date);
            //########################################################
            //########################################################
            //########################################################
            //######################################################## 
            
            //イベントをフィルタにかけて格納し直す(検索済みのobjectを生成)
            //
            //
            //
            //
            //all_iventDataに入っている要素数を一度０にして初期化してからカウント
            var ivent_length = 0;
            ivent_length = Object.keys(all_iventData).length;

            
            //フィルターをかけたイベントを格納するobjectを生成・初期化
            var filtered_iventData = {} ;
            var filtared_ivent_length = 0;
            
            //for文でS1のall_iventDataには入っているキー値の数(ivent_length)だけ回す
            for(var i=0;i < ivent_length ; i++ ){
                
                //iventDataにイベントの情報を格納
                var iventdata = all_iventData[i];
                
                //イベント情報(iventData)の特定のキー値がvalueの値と一致するときにfiltered_ivent[]に0から順番にキー値を設定しイベント情報(iventData)を格納
                //参照する場所をivent[8]に変更##########################
                //###################################################
                //###################################################
                //###################################################
                if(iventdata[8] == selected_genre){
                //###################################################
                //###################################################
                //###################################################
                //###################################################
                    filtered_iventData[filtared_ivent_length] = iventdata;
                    
                    //次のキー値のために1をたす
                    filtared_ivent_length = filtared_ivent_length + 1 ;
                }
                
            }
            //ログに出力
            console.log("filtared_ivent_length is " + filtared_ivent_length);
            console.log("filtered_iventData is " + filtered_iventData);
            
            
            

            
            
            //マーカーの設置
            //
            //
            //
            //
            //イベントの数だけマーカーの生成を行う
            for(var i = 0;i < filtared_ivent_length ; i++){
                
                
                
                var marker_number ;
                
                //marker_numberの重複回避のためのif文
                if(marker_amount == 0){
                    marker_number = 1;
                }else{
                    marker_number = marker_amount +1;
                }
                
                marker_number = marker_number + i ;
                
                
                
                
                //イベントデータの取得.
                ivent[marker_number] = filtered_iventData[i];

                //filtered_iventData[]からキー値を指定してオブジェクトivent[]として取り出す
                //0:日にち
                //1:時間
                //2:施設名
                //3:住所
                //4:イベント名
                //5:電話番号
                //6:内容の説明
                //7:番地
                //8:ジャンル
                //が取得できる。(例: ivent[4] → ニコニコタイムXmasスペシャル)
                
                
                
                //マーカーの設定
                //var marker = []; //インスタンス化のための変数
        
                
                //GeoCodeの取得
                var marker_location = {};
                
                //for文でS1のgeocode_dataArray全てのaddressとivent[3]を検証
                for(var a = 1; a< ivent_length +1 ; a++){
                    
                    //一致した時のみ、marker_locatonに緯度経度を格納
                    if(ivent[marker_number][3] == geocode_dataArray[a]["address"]){
                        marker_location = {
                            lat: geocode_dataArray[a]["location"][1], // 緯度
                            lng: geocode_dataArray[a]["location"][0]// 経度
                        };   
                    }
                }
                
 
                //GeoCodeをmarkerpositionに格納
                var marker_position;
                
                marker_position = {
                        lat: marker_location["lat"], // 緯度
                        lng: marker_location["lng"]// 経度
                    };
                
                console.log(marker_position);

                //マーカーを生成する(情報が重複しないために引数としてmarker_numberを渡している)
                markermake(marker_number,marker_position);
                
                
                var infowindow_bars = document.getElementById("infowindow-bars");
                var div_element = document.createElement("div");
                div_element.setAttribute('class', 'info-bars');
                div_element.innerHTML = ivent[marker_number][4];
                infowindow_bars.appendChild(div_element);
                
                
            }
            
            marker_amount = marker_amount + filtared_ivent_length;
            console.log("marker_amount is " + marker_amount);
    
        }
        

        //マーカーの生成をする関数
        function markermake(numbering,location){

                //マーカーの生成 (marker[]が重複せず格納されるようにする)
                marker[numbering] = new google.maps.Marker({ // マーカーの追加
                    position: location, // マーカーを立てる位置を指定
                    map: main_mapview // マーカーを立てる地図を指定
                });
                
            
                //生成した情報ウィンドウをどのマーカーに対応させるか
                marker[numbering].addListener('click', function() { // マーカーをクリックしたとき
                    //infoWindow[marker_number].open(main_mapview, marker[marker_number]); // マップとマーカーの指定(非表示にする)
                     info_div_view(numbering);
                    
                    $().ready(function(){
                        $("#infowindow-output,#infowindow-wrapper").show();
                    });
                });

        }




        //マーカー削除の関数
         function removeMarker(map){
             for(var i=1; i<= marker_amount; i++){
                    marker[i].setMap(map);
             }
             
             var infowindow_bars = document.getElementById("infowindow-bars");
             infowindow_bars.innerHTML = " ";
         }



        //クリックされたら表示するdivの設定
         function info_div_view(num){
                document.getElementById("infowindow-output-iventtitle").innerHTML = ivent[num][4];
                document.getElementById("infowindow-output-time").innerHTML = ivent[num][1];
                document.getElementById("infowindow-output-place").innerHTML = ivent[num][2];
                document.getElementById("infowindow-output-location").innerHTML = ivent[num][3];
                document.getElementById("infowindow-output-etc").innerHTML = ivent[num][6];                    
                document.getElementById("infowindow-output-tel").innerHTML = "<a href='tel:042-" + ivent[num][5] + "'>042-" + ivent[num][5] + "</a>";
                //移動ボタンにivent[3]を目的地として挿入
                document.getElementById("open_navigation").href = "http://maps.google.com/maps?saddr=&daddr=" + ivent[num][3] +"&z=15"
                console.log(ivent[num]);
         }


// S4
//挙動に関するscript文################################################# //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//

    $(function () {
        $().ready(function(){
            $("#infowindow-output,#infowindow-wrapper").hide();
                    
        });
        
    
        $("#infowindow-output").click(function (e) {
            e.stopPropagation();
        });      
        
        $("#infowindow-wrapper").click(function () {

            $('#infowindow-output,#infowindow-wrapper').fadeOut();
        });  

		$(".genre_button").click(function () {
            $('#wrapper3').slideUp();
        }); 
        
        $("#back-to-genre").click(function () {
            $('#wrapper3').slideDown();
        }); 
        
        $("#toggle-infowindow-bars").click(function () {
            $('#infowindow-bars').toggle();
        }); 
        

        
        
        $(function() {
            var h = $(window).height();

          
          $('#loader-bg ,#loader').height(h).css('display','block');
        });
 
        
        //ソースコードの読み込み完了時の処理
        $(window).load(function () { //全ての読み込みが完了したら実行
          //initialize()を起動してjsonを読み込む
          initialize();    
          $('#loader-bg').delay(900).fadeOut(800);
          $('#loader').delay(600).fadeOut(300);
          
        });
 
        //10秒たったら強制的にロード画面を非表示
        $(function(){
          setTimeout('stopload()',10000);
        });
 
        function stopload(){
           
          $('#loader-bg').delay(900).fadeOut(800);
          $('#loader').delay(600).fadeOut(300);
            
        }
        
        
        
        
        
	});
        
    
// S5
//ジャンル選択に関するscript文################################################# //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
    
    function select_genre(genreID){
            //ジャンルボタンのvalue値を取得して格納
            get_genre = document.getElementById(genreID).value;
            console.log(get_genre);
            initMarker();     
    }  
    