!SLIDE
# Effective Javaを読む会

## 6回目

## [@numa08](https://twitter.com/numa08)

!SLIDE

## お品書き

 - 配列よりリストを選ぶ(項目25)
 - ジェネリック型を利用する(項目26)

!SLIDE

## 配列よりリストを選ぶ

## たった2つの配列とジェネリック型の違い

 - 共変(convariant)であること
 - 具象化(reified)されていること

!SLIDE

## 共変であること


 - `Sub`が`Super`のサブタイプのとき
 - `Sub[]`は`Super[]`のサブタイプである

## 不変(invariant)であること

 - `Sub`が`Super`のサブタイプのとき
 - `List<Sub>`は`List<Super>`のサブタイプではない

!SLIDE

## 共変と不変


```java
Object[] array = new Long[1];
array[0] = "I am long"; //ArrayStoreException

List<Object> list = new ArrayList<Object>();
list.add("I am object"); //コンパイルエラー
```


後者の方が、実行前に分かるので安全と言える。

!SLIDE

## 具象化されていること

 - 配列は実行時に要素の型を知る
 - 型に対する不正な動作は、実行時に分かる

## イレイジャ

 - コンパイル時のみ型制約を強制
 - 実行時には型情報は無くなっている
 - ジェネリクス未使用のコードとの互換性！！
 - Java9から無くなるとかなんとか？

!SLIDE

## ジェネリクスと配列


```java
List<String>[] stringLists = new ArrayList<String>[1]; //コンパイルエラー
List<Integer> intList = Arrays.asList(42);
Object[] objects = stringLists;
objects[0] = intList;
String s = stringLists[0].get(0); //ClassCastException!!
```


コンパイル時に未然に型に対する不正な操作を防ぐ

!SLIDE

## 積極的にコレクションを使え

 - ジェネリクスの配列は基本的に無理
 - ジェネリクスのコレクションを扱うなら、積極的にCollection APIを使え

!SLIDE

## reduceの実装を考える

 - 不定の型のコレクション、適応する関数を受け取って関数を適応して帰す


```java
reduce(List(1, 2, 3) , (_ + _), 0) // 0 + 1 + 2 + 3 -> 6
reduce(List(4, 5, 6) , (_ * _), 2) // 2 * 4 * 5 * 6 -> 240
```


!SLIDE

## reduce


```java
public <E> E reduce(List<E> list, Function<E, E, E> f, E r) {
  List<E> snap;
  synchronized(list) {
    snap = new ArrayList<E>(list);
  }
  E result = r;
  for(E e : list) {
    r = f.apply(result, e);
  }
  return result;
}

interface Function<A, B, C> {
  C apply(A, B);
}

```


!SLIDE


```java
public void reduceTest() {
  final int result = reduce(Arrays.asList(1,2,3),
			     new Function<Int, Int, Int> {
				Int apply(Int a, Int b) { return a + b;}
                             }, 0);
  assertThat(result, is(6));
}
```


!SLIDE


## 今、こんなことをやらないように


!SLIDE


```java
final List<Integer> list = Arrays.asList(1,2,3);
list.stream()
    .reduce(0, (a, b) -> a + b));//6
```


!SLIDE

## [numa08/stack.java](https://gist.github.com/numa08/a166ad60cf75543044dc)

