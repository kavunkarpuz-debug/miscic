# bismillah — Claude Code mod

Claude Code'a gönderdiğin her prompt'a verilen cevap, seçtiğin bir satırla açılır. Varsayılan: **Bismillahirrahmanirrahim**.

```
> merhaba
● Bismillahirrahmanirrahim

  Merhaba! ...
```

- Sadece senin yazdığın promptların cevabında, cevabın ilk metin bloğunda çıkar; araç çağrıları arasındaki ara metinlerde tekrar etmez.
- Yalnızca ekranda görünür: modele gönderilmez, konuşma kaydını değiştirmez.

## Kurulum

Claude Code **2.1.287** veya üstü gerekir (`claude --version`). Claude Code içinde:

```
/plugin marketplace add kavunkarpuz-debug/bismillah-mod
/plugin install bismillah@bismillah-mod
/reload-plugins
```

Kaldırmak için: `/plugin uninstall bismillah@bismillah-mod`

## Açılış satırını değiştirmek

Varsayılan metin *Bismillahirrahmanirrahim*. İstediğin başka bir satırla değiştirebilirsin. Boş bırakırsan hiçbir şey eklenmez.

Claude Code içinde `/plugin configure bismillah@bismillah-mod`, ya da terminalde:

```bash
echo '{"line":"Hadi bakalım"}' | claude plugin configure bismillah@bismillah-mod --values-stdin
```

## Nasıl çalışır

`bismillah/hooks/register.tsx`, iki kancadan oluşur:

1. `session.append` — senin prompt'undan sonra gelen ilk metinli cevap satırının id'sini oturum durumuna kaydeder.
2. `ui.render` (`AssistantMessage`) — o satır çizilirken metnin başına ayarlanan açılış satırını ekler.

Test: `claude plugin test ./bismillah`

---

## English

A Claude Code mod that opens every reply to your prompt with a line of your choice. The default is **Bismillahirrahmanirrahim** ("In the name of God, the Most Gracious, the Most Merciful"), which many Muslims say before starting any work.

- Shown only on replies to prompts you typed, on the first text block of the reply.
- Display only: nothing is sent to the model and the transcript is not changed.

**Install** (requires Claude Code 2.1.287+), inside Claude Code:

```
/plugin marketplace add kavunkarpuz-debug/bismillah-mod
/plugin install bismillah@bismillah-mod
/reload-plugins
```

Uninstall: `/plugin uninstall bismillah@bismillah-mod`

**Change the line:** `/plugin configure bismillah@bismillah-mod` inside Claude Code, or in a terminal:

```bash
echo '{"line":"Ready when you are"}' | claude plugin configure bismillah@bismillah-mod --values-stdin
```

Leave it empty to show nothing.

License: MIT
