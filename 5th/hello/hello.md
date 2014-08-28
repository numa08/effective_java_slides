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

そもそもequalsとは？

 - オブジェクト(インスタンス)の論理的等価性を検査するためのメソッド
 - すべての参照型に共通するメソッドの一つ
 
!SLIDE

## equalsの振る舞い


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

assertThat(x.equals(y),is(true));
// a long time ago...
assertThat(x.equals(y),is(true));

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
