!SLIDE
# 

## えふえぇ(>_<)くてぃぶ

## 	Java


<a href="http://www.amazon.co.jp/gp/product/4621066056/ref=as_li_qf_sp_asin_il?ie=UTF8&camp=247&creative=1211&creativeASIN=4621066056&linkCode=as2&tag=reading-effecivejava-22"><img border="0" src="http://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4621066056&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=reading-effecivejava-22" ></a><img src="http://ir-jp.amazon-adsystem.com/e/ir?t=reading-effecivejava-22&l=as2&o=9&a=4621066056" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

!SLIDE

## オブジェクトの生成と消滅

 - どのようにオブジェクトを生成すべきか
 - どのようにオブジェクトの生成を回避すべきか

!SLIDE

## コンストラクタの代わりにstaticファクトリーメソッドを検討する

 - インスタンスをクライアントコードが得る方法
     - publicなコンストラクタを提供する
     - publicなstaticファクトリーメソッド(static factory method)を提供する

!SLIDE

## Factory Method(GOF)

 - `Factory`となるインスタンスを利用して、目的のオブジェクトのインスタンスを作る
 - Clientからは、生成されるクラスを意識しなくて良い
 - 今回の話題とは直接の関係ない

![](http://news.mynavi.jp/column/objc/061/images/Classes.jpg)

!SLIDE

## Factory Mewthod(GOF)

### Javaを利用した実装イメージ


```java
public class ProductA implements Product{}
public class ProductB implements Product{}
public class ProductFactory {
    //実は、AbstractFactoryパターンな気がする
    public  Product createProduct(String productId) {
        if ("Product_A".equals(productId)) {
            return new ProductA();
        } else if("Product_B".equals(productId)) {
            return new ProductB();
        }
        throw new NoProductException(productId + "is not valid id");
	}
}
fina ProductFactory factory = new ProductFactory();
final Product product = factory.createProduct("Product_A");
```

!SLIDE

## Factory Method(GOF)

### Androidでの利用例


```java
final LayoutInflater inflater = 
    (LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
```


!SLIDE

## staticファクトリーメソッドの長所

 - 名前を持つことができる
 - 新たなオブジェクト生成をする必要がない
 - 戻り値の型を任意のサブタイプのオブジェクトにできる
 - パラメータ化された型のインスタンス生成の面倒さを低減

!SLIDE

## staticファクトリーメソッドの短所

 - public,protectedコンストラクタを持たないクラスのサブクラスを作れない
 - 他のstaticメソッドと区別がつかない

!SLIDE

## 名前を持つことができる

 - コンストラクタはいつでもクラスと同じ名前
 - コンストラクタに対するパラメータが、返されるオブジェクトを表現しないケースに有効
 - 結果、クライアントコードが読みやすくなる

!SLIDE

## 名前を持つことができる


```java

// 文字列を解析して整数を生成していることが、明示的でない
final Integer value = new Integer("100");

// 文字列を解析して整数を生成していることが、明示的
final Integer value = Integer.parseInt("100");
```


 - 文字列を解析して`Intger`の生成を行う
 - _解析_ なので、失敗すると例外が投げられる。(NumberFormatException)
 - `parseInt`の方が、解析(parse)することが明示的
 - [GpreCode/Integer](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8-b132/java/lang/Integer.java#Integer.%3Cinit%3E%28java.lang.String%29)

!SLIDE

## 新たなオブジェクトを生成する必要がない

 - あらかじめ生成しておいたインスタンスを利用することもできる
 - クライアント側に意識させる必要がない

!SLIDE

## 新たなオブジェクトを生成する必要がない


```java

// Integerインスタンスが生成される
final Integer value = new Integer(1);

// -128 ~ 127（メモリの状態により異なる）の間では
// キャッシュが利用される
final Integer value = Integer.valueOf(1);
```


 - _インスタンスが制御されている_ と表現するらしい
 - パフォーマンス上有利になりえる
 - シングルトン、インスタンス化不可能なオブジェクトの生成など
 - [GrepCode/Integer](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8-b132/java/lang/Integer.java#Integer.valueOf%28int%29)

!SLIDE

## メソッドの戻り値型を任意のサブタイプにできる

 - 返すオブジェクトのクラスをpublicにしないこともできる
 - パラメータに応じて返すオブジェクトを変えることが出来る

!SLIDE

## メソッドの戻り値型を任意のサブタイプにできる


```java
// 普通のArrayList
final List<Integer> list = new ArrayList<>();
list.add(1);

// スレッドセーフなArrayList
final List<Integer> list = Collections.synchronizedList(new ArrayList<Integer>());
list.add(1);
```


 - 後者は実は`SynchronizedList`を利用している
 - クライアントは無意識に利用できる
 - [GrepCode/Collections](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8-b132/java/util/Collections.java#2451)

!SLIDE

## パラメータ化された型のインスタンス化の面倒さを低減


```java
// 左辺、右辺で型パラメータを定義していて冗長
final Map<String, String> map= = new HashMap<String, String>();

// 左辺のみでの定義になってシンプル
final Map<String, String> map = HashMap.newInstance();
```


 - ただし、このメリットはJava6まで

!SLIDE

## パラメータ化された型のインスタンス化の面倒さを低減

 - Java7以上、あるいは最近のAndroidではダイアモンド構文を使いましょう


```java
// 右辺の型パラメータを省略できる
final Map<String, String> map = new HashMap<>();
```


!SLIDE

## public,protectedコンストラクタを持たないクラスのサブクラスは作れない

 - staticファクトリーメソッドを使えばインスタンスの提供はできるが、サブクラスは作れない
 - 不便っちゃ不便

!SLIDE

## public,protectedコンストラクタを持たないクラスのサブクラスは作れない


```java
// privateなコンストラクタしか持たないクラス
public class Product {
    private Product(){} 

    // staticファクトリーメソッドで、インスタンスを
    // 作る
    public static Product getInstance() {
    	return Product;
    }
 }
// コンパイルエラー
public class ProductA extends Product{}
```


!SLIDE

## 他のstaticメソッドと区別が付かない

 - ファクトリーメソッドではないstaticメソッドが同時にある場合
 - メソッド名前から役割を連想できないと、辛い
 - メソッド名は適切な名前を( ｰ`дｰ´)ｷﾘｯ


!SLIDE

## 他のstaticメソッドと区別がつかない

 - valueOf/of
    - パラメータと同じ値を持つインスタンスを返す
    - `Integer.valueOf`
- getInstance
    - パラメータと同じ値を返すとは限らない
    - シングルトンの場合もある
- newInstance
    - シングルトンではない

!SLIDE

## まとめ

 - staticファクトリーメソッドのもつ利点は多い
 - たいていの場合、コンストラクタより好ましい
 - 安易にコンストラクタの提供をするより、staticファクトリーメソッドの検討をする


!SLIDE

## たいていの場合、コンストラクタより好ましい？？？

 - 好ましくないケースもある
 - 「型」に情報を持たせるケース

!SLIDE

## 型に情報を持たせたい


```java
// スレッドセーフなArrayList
final List<Integer> list = Collections.synchronizedList(new ArrayList<Integer>());
list.add(1);
```


 - `list`のスコープが広がると、スレッドセーフなのかわかりにくくなるような？
 - `SynchronizedList`はクライアントは参照できないクラス
 - 単純な`List`としての情報のみしか、クライアントは持つことができない
 - そもそもスコープを広げるなって話ではあるが

!SLIDE

## 数多くのコンストラクタパラメータに直面した時にはビルダーを検討する

 - コンストラクタのパラメータが多い場合はバグを容易に生む
 - 特に、パラメータの型が同じ物が並んでいる場合は地獄絵図
 - テレスコーピングコンストラクタパターン
 - JavaBeansパターン

!SLIDE

## テレスコーピングコンストラクタパターン

 - コンストラクタをオーバーロードする
 - 初期値を定義する
 - 伝統的なやり方
 - コードの例はp.11参照

!SLIDE

## テレスコーピングコンストラクタパターン

 - 分かりやすいデメリット


```java
final NutritionFats cocaCola = new NutritionFats(210, 8, 100, 0, 35, 27);
final NutritionFats pepsiCola = new NutritionFats(210, 8, 100, 0, 27, 35);
```


 - ???「コンストラクタの第五引数と第六引数を入れ替えたけど、分かるかな？」

!SLIDE

## JavaBeansパターン

 - インスタンスを生成するのは容易
 - メソッド名に気をつければ、コードも読みやすい

!SLIDE

## JavaBeansパターン


```java
// 今からインスタンスを作るので、この間に処理を入れないこと！！
final NutritionFats cocaCola = new NutritionFats();
cocaCola.setServingSize(240);
new Thread(new Runnable(){
 public void run() {
    // ククク・・・
    cocaCola.setServings(100000);
 }
}).start();
cocaCola.setServings(8);
cocaCola.setSodium(35);
```


 - スレッドアンセーフ
 - 生成中はオブジェクトが不整合かもしれない

!SLIDE

## JavaBeansパターン

 - 「名前付き引数」を意識したパターン


```ruby
def param_with_name(name : "undefined", age: 0)
    puts "name=#{name}, age is #{age}"
end

param_with_name(name: "numa08", age: 10)
# name=numa08, age is 10
```


!SLIDE

## ビルダーパターン

 - テレスコーピングパターンの安全性
 - JavaBeansパターンの可読性
 - クライアントはビルダーオブジェクトを生成する
 - ビルダーから目的のインスタンスを生成する

!SLIDE

## ビルダーパターン

### Androidの例

```java
final AlertDialog dialog = new AlertDialog
                           .Builder(context)
                           .setIcon(icon)
                           .setTitle("dialog")
                           .setMessage("this is dialog")
                           .create();
```


!SLIDE

## 抽象ファクトリーパターン

 - 生成するインスタンスのクラスを、クライアント側で意識しないパターン
 - リフレクションを駆使して、実装できる感じ
 - 伝統的な手法らしい
 - 型安全じゃない！！

!SLIDE

## 抽象ファクトリーパターン


```java
final Object obj = Class.forName("MyClass").newInstance();
```


 - 目的のクラスが、パラメータなしのコンストラクタを持っていないかもしれない
 - そもそも、目的のクラスが参照できないかもしれない
 - 全く型安全じゃない。

!SLIDE

## 抽象ファクトリーパターン


```java
public interface Builder<T> {
    public T build();
}
public class Tree extends Node{
	public static buildTree(Builder<? extends Node nodeBuilder) {...}
}

// クライアント
public class NodeBuilder implements Builder<Node> {
	public NodeBuilder addNode(String node) {...}

	public Node build() {
		return Tree.buildTree(this);
	}
}
final Node tree = new NodeBuilder()
                  .addNode("hoge")
                  .addNode("bar").build();
```


!SLIDE

## 抽象ファクトリーパターン

 - Builderのインターフェースを公開することで、クライアントでオブジェクト生成を制御できる
 - 生成されるインスタンスは、ライブラリ側で吸収できる
 - 型安全

!SLIDE

## ビルダーパターンのデメリット

 - ビルダーの生成コスト
 - 長くなる

!SLIDE

## まとめ

 - パラメータが沢山あるときに検討するべき
 - メソッドチェーンをうまく使えば、お手軽にスレッドセーフ

!SLIDE

## 思う所もある

 - Javaは型宣言=クラスの宣言
 - `typedef`的な物があれば、テレスコーピングコンストラクタはわりと便利
 - ちなみに、Scalaには`type`がある
 - ビルダーパターン自体はスレッドセーフではない
 - 異なるスレッドからの呼び出しを、普通はしないだけ
 - 実際StringBuilderはスレッドアンセーフ
 - ちなみに、StringBufferはスレッドセーフ

!SLIDE

## 思う所

 - クラスはイミュータブルであるべき
 - スレッドセーフ、バグ対策
 - 実現のためにはビルダーパターンが欠かせない
