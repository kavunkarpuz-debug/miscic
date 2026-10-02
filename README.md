# miscic — Claude Code için karışık modlar

Claude Code **2.1.287** veya üstü gerekir (`claude --version`). Önce marketplace'i bir kez ekle, sonra istediğin modu kur:

```
/plugin marketplace add kavunkarpuz-debug/miscic
/plugin install bismillah@miscic
/plugin install tavuk@miscic
/reload-plugins
```

Her mod ayrı kurulur, ayrı kapatılır: `/plugin uninstall <mod>@miscic`

| Mod | Ne yapar |
|---|---|
| [bismillah](#bismillah) | Her cevap seçtiğin bir satırla açılır (varsayılan: *Bismillahirrahmanirrahim*) |
| [tavuk](#tavuk) | Prompt'un üstündeki şeritte sarı bir civciv yürüyüp prompt'unun harflerini gagalar |

## bismillah

Claude Code'a gönderdiğin her prompt'a verilen cevap, seçtiğin bir satırla açılır:

```
> merhaba
● Bismillahirrahmanirrahim

  Merhaba! ...
```

- Sadece senin yazdığın promptların cevabında, cevabın ilk metin bloğunda çıkar.
- Yalnızca ekranda görünür: modele gönderilmez, konuşma kaydını değiştirmez.

**Satırı değiştirmek:** Claude Code içinde `/plugin configure bismillah@miscic`, ya da terminalde:

```bash
echo '{"line":"Hadi bakalım"}' | claude plugin configure bismillah@miscic --values-stdin
```

Boş bırakırsan hiçbir şey eklenmez. Değişiklik Claude Code yeniden başlatılınca geçerli olur.

**Nasıl çalışır:** `session.append` kancası prompt'undan sonraki ilk metinli cevap satırının id'sini kaydeder; `ui.render` (`AssistantMessage`) o satır çizilirken başına açılış satırını ekler.

## tavuk

Prompt kutusunun üstündeki şeritte bir 🐤 dolaşır:

```
   m     r       🐤 ·    a              b
> _
```

- Gönderdiğin her prompt'un harfleri şeride yem olarak saçılır.
- Civciv sağ uçtan sola yürür, önüne gelen harfi gagalar. Bazen ıskalar, harf titrer; yediği harfin yerinde `·` kırıntı kalır.
- Sol uca varınca sağ uca ışınlanır. Yem bitince bir süre aç gezer, sonra rastgele harfler saçılır.
- `/tavuk` civcivi gizler / geri getirir.

Civciv emojisi yazı tipinin renkli çizimidir; terminalin renkli emoji desteklemesi gerekir (Windows Terminal, macOS Terminal, iTerm2 vb.).

---

## English

**miscic** — miscellaneous small mods for Claude Code (requires 2.1.287+).

```
/plugin marketplace add kavunkarpuz-debug/miscic
/plugin install bismillah@miscic
/plugin install tavuk@miscic
/reload-plugins
```

- **bismillah** — opens every reply to your prompts with a line of your choice. The default is *Bismillahirrahmanirrahim* ("In the name of God, the Most Gracious, the Most Merciful"), which many Muslims say before starting any work. Display only. Change it with `/plugin configure bismillah@miscic` (empty shows nothing; restart to apply).
- **tavuk** ("chicken" in Turkish) — a little 🐤 walks right-to-left along the band above the prompt, pecking at the letters of your prompts and leaving crumbs. It teleports back to the right edge when it reaches the left. `/tavuk` hides or shows it.

License: MIT
