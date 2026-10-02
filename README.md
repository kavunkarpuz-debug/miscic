# bismillah — Claude Code mod

Claude Code'a gönderdiğin her prompt'a verilen cevap **Bismillahirrahmanirrahim** ile açılır:

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

## Nasıl çalışır

`bismillah/hooks/register.tsx`, iki kancadan oluşur:

1. `session.append` — senin prompt'undan sonra gelen ilk metinli cevap satırının id'sini oturum durumuna kaydeder.
2. `ui.render` (`AssistantMessage`) — o satır çizilirken metnin başına besmeleyi ekler.

Test: `claude plugin test ./bismillah`

---

## English

A Claude Code mod that opens every reply to your prompt with **Bismillahirrahmanirrahim** ("In the name of God, the Most Gracious, the Most Merciful").

- Shown only on replies to prompts you typed, on the first text block of the reply.
- Display only: nothing is sent to the model and the transcript is not changed.

**Install** (requires Claude Code 2.1.287+), inside Claude Code:

```
/plugin marketplace add kavunkarpuz-debug/bismillah-mod
/plugin install bismillah@bismillah-mod
/reload-plugins
```

Uninstall: `/plugin uninstall bismillah@bismillah-mod`

License: MIT
