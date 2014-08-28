!SLIDE
# Effective Javaを読む会

## 5回目くらい

## [@numa08](https://twitter.com/numa08)

!SLIDE

## お品書き

 - equalsの話(項目8)
 - hashCodeの話(項目9)
 - ジェネリクス(総称型)の話(項目23,24)

!SLIDE

## equalsをオーバーライドする時は一般契約に従う

### そもそもequalsとは？

 - オブジェクト(インスタンス)の論理的等価性を検査するためのメソッド
 - すべての参照型に共通するメソッドの一つ


```java
class Object {
  public boolean equals(Object obj) {
    return (this == obj);
  }
}
```


!SLIDE

## 論理的等価性


```java
"hogehoge".equals("hogehoge"); //true
"hogehoge" == "hogehoge"; //false
```


 - 上は論理的等価性検査
 - 下は等値性検査

!SLIDE

## equalsをオーバーライドしないケース

equalsのオーバーライドはバグの要因。必要のないときには無闇矢鱈にオーバーライドしない


 - クラスの個々のインスタンスが本質的に一位であるケース
     - クラスが値やデータよりも、振る舞いを表現している場合
 - 論理的等価性検査をする必要がない
     - ケースバイケースで
 - すでにスーパークラスがequalsをオーバーライドしていて、機能が十分な場合
 - クラスがprivateあるいはパッケージプライベートであり、eequalsが呼び出されない
     - 呼び出されるのは例外的ケースと言えるので、例外飛ばそう

!SLIDE

## equalsをオーバーライドするケース

 - データや値を格納するクラス
 - jUnitなどでテストを書くケース
 - HashMapで管理するケース
 - enumが利用できないケース

!SLIDE

## 一般的契約とは

5個ある要件を満たすもの

 - 反射的である
 - 対照的である
 - 推移的である
 - 整合的である
 - x.equals(null) == falseである

!SLIDE

## 反射的である


```java
assertThat(x.equals(x),is(true));
```


!SLIDE

## 対照的である


```java
assertThat(x.equals(y) == y.equals(x), is(true));
```

!SLIDE

## 推移的である


```java
if(x.equals(y) && y.equals(z)) {
  assertThat(z.equals(x),is(true));
}
```


!SLIDE

## 整合的である


```java
assertThat(x.equals(y),is(true));
// a long time ago...
assertThat(x.equals(y),is(true));
```

!SLIDE

## 今やると恥ずかしい書き方

```java
final boolean isEqual;
if(x != null) {
  isEqual = x.equals(y);
} else {
  isEqual = false;
}
```


!SLIDE

## これはまあ許容されるけど、格好良くない


```java
//xがnullでも問題ない
final boolean isEqual = Objects.equals(x, y);
// ax, ayの両方あるいは一方が配列やコレクションの場合
final boolean isEqual = Objects.deepEquals(ax, ay);
```


!SLIDE

## 今風の書き方


```java
final boolean isEqual = 
	Optional.of(x)
        .map((x) -> {x.equals(y)})
        .orElse(false);
```


!SLIDE

## equalsをオーバーライドするときは、hashCodeをオーバーライドする

 - そういう仕様なので
 - HashMapなどの動きがおかしくなる

!SLIDE

## hashCodeのオーバーライド

古のやり方


```java
@Override
public int hashCode() {
  int result = 17;
  result = 31 * result + age;
  result = 31 * result + name.hashCode();
  result = 31 * result + work.hashCode();
  return result;
}
```


!SLIDE

##今のやり方


```java
@Override
public int hashCode() {
  return Objects.hash(age, name, work);
}
```


!SLIDE

## ちなみに


```java
(x.equals(y)) == (x.hashCode() == y.hashCode());
```


!SLIDE

## 新たなコードで原型を利用しない

!SLIDE

## 人間止めますか？型安全やめますか？

![](hello/img1.jpg)

[http://www.jigokushoujo.com/character/ai02.html](http://www.jigokushoujo.com/character/ai02.html)

!SLIDE

## 今時こんなことらないよね？

```java
// 今時こんなのやる人はいない
final List names = new ArrayList(); //Stringが欲しいな
names.add("nobita");
names.add("mitsuo");
names.add("shouta");
names.add(9); //oh...
for(Object n : names) {
  String name = (String)n; //Class Cast Exception
  System.out.println(name);
}
```

!SLIDE

## 現代の常識


```java
final List<String> names = new ArrayList<>();
names.add("bakeru");
names.add("takahata");
names.add("bonn");
names.add(0); //コンパイルエラー！！
```

!SLIDE

## 今を生きよ


```java
final List<String> names = 
	Arrays.asList("mikio","saenai","dobinson");
names.forEach(s -> System.out.println(s));
```


!SLIDE

## ジェネリクスの話

 - [Martin Odersky](https://twitter.com/odersky)先生が開発者
 - この人はScalaの開発者
 - 来月、来日するよ！

!SLIDE

## ジェネリクス以前

 - java1.2とかの頃
 - [The Pizza Compiler](http://pizzacompiler.sourceforge.net/)
 - ジェネリクスや無名関数が導入された、jvmで動作する言語

!SLIDE

## Pizza


```java
class StoreSomething<A> {
     A something;

     StoreSomething(A something) {
         this.something = something;
     }

     void set(A something) {
         this.something = something;
     }

     A get() {
         return something;
     }
}
```

!SLIDE


## Pizzaが一番愛した娘、それはJava

 - Java5でジェネリクスが導入されたあたりで、Pizzaの開発は止まっているっぽい
 - Java8でラムダも取り入れられたので、Pizzaの機能はほぼ網羅した？

!SLIDE

## Javaは型安全？

 - 静的で強い型付け
 - ジェネリクスや境界値による安全で柔軟な型の操作
 - 突然のダウンキャスト！！
 - SuperType -> SubTypeのキャストをやりまくると死ぬよ！！ 
 - もう一声欲しいところ

!SLIDE

## そこでScalaですよ！！

 - 構造的部分型
 - typeで、特定のメソッドを実装した型を定義できる
 - Duck Typingできる！

```scala
type Duck = { def quack() : String}
```

!SLIDE

## 構造的部分型


```java
Bird tori = ...
((Duck)bird).quack();
```


!SLIDE

## 複合型

 - 複数のtraitを実装していることを表す型
 

```scala
trait Clonable { def clone() : Clonable}
trait Resetable { def reset : Unit}
def cloneAndRest(obj : Clonable with Resetable) : Clonable = {
 val org = obj.clone()
 obj.reset
 org
}
```

!SLIDE

## 複合型


```java
interface CloneableAndResetable 
	extends Cloneable,
	Resetable{}
```


!SLIDE

## [型システム入門](http://www.amazon.co.jp/%E5%9E%8B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E5%85%A5%E9%96%80-%E2%88%92%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E8%A8%80%E8%AA%9E%E3%81%A8%E5%9E%8B%E3%81%AE%E7%90%86%E8%AB%96%E2%88%92-Benjamin-C-Pierce/dp/4274069117)

![](hello/img2.jpg)
