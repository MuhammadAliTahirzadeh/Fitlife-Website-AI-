# Profil Avatar Funksionallığı

## Əlavə edilmiş xüsusiyyətlər

### 1. **Profil Şəkli Yükləmə** (Settings Səhifəsi)

#### Xüsusiyyətlər:
- ✅ Böyük yaşıl dairəvi profil avatarı (64px × 64px)
- ✅ Hover edəndə kamera ikonu görünür
- ✅ Kliklədikdə fayl seçici açılır
- ✅ Dəstəklənən formatlar: JPG, PNG, GIF, WebP və s.
- ✅ Şəkil localStorage-də saxlanılır
- ✅ Uğurlu/xətalı əməliyyat üçün toast bildirişlər

#### İstifadə:
1. Settings səhifəsinə gedin
2. Profile bölməsinə keçin
3. Yaşıl dairəyə klik edin
4. Şəkil seçin
5. Şəkil avtomatik yüklənəcək və saxlanacaq

---

### 2. **Bütün Səhifələrdə Profil Avatar Navigasiyası**

#### Xüsusiyyətlər:
- ✅ Header-də sağ küncdə yaşıl dairəvi avatar (40px × 40px)
- ✅ Kliklədikdə `settings.html#profile` səhifəsinə yönləndirir
- ✅ Settings səhifəsində avtomatik profil bölməsinə scroll edir
- ✅ Profil kartını 2 saniyə highlight edir (vizual feedback)
- ✅ Hover effekti: böyüyür və parlaq yaşıl glow effekti

#### Əhatə edilən səhifələr:
- Dashboard (index.html)
- Workout (workout.html)
- Nutrition (nutrition.html)
- Note (note.html)
- Settings (settings.html)

#### İstifadə:
İstənilən səhifədə, header-in sağ küncündəki yaşıl dairəyə klik edin → avtomatik olaraq settings səhifəsinin profil hissəsinə yönləndiriləcəksiniz.

---

### 3. **Profil Şəklinin Sinxronizasiyası**

#### Xüsusiyyətlər:
- ✅ Settings-də yüklənən şəkil avtomatik bütün səhifələrdə göstərilir
- ✅ localStorage vasitəsilə persistent saxlanma
- ✅ Səhifə yenilənəndə şəkil qalır
- ✅ Browser bağlanıb açıldıqdan sonra da saxlanır

#### Texniki Detallar:
- **Storage Key**: `fitlife_profile_image`
- **Format**: Base64 encoded data URL
- **Maksimum ölçü**: ~5MB (localStorage limiti)

---

### 4. **Data İdarəetməsi**

#### Export funksionallığı:
Profil şəkli export edilmiş JSON faylına daxildir:
```json
{
  "workouts": [...],
  "meals": [...],
  "notes": [...],
  "settings": {...},
  "profileImage": "data:image/png;base64,...",
  "exportDate": "2025-10-13T...",
  "version": "1.0"
}
```

#### Import funksionallığı:
- Import edərkən profil şəkli də bərpa edilir
- Əgər import edilən faylda profil şəkli yoxdursa, mövcud şəkil saxlanır

#### Reset funksionallığı:
- "Reset All Data" düyməsi profil şəklini də silir
- Default yaşıl gradient geri qayıdır

---

## CSS Stilləri

### Header Profil Avatarı:
```css
.profile-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), #19d4b5);
    cursor: pointer;
    background-size: cover;
    background-position: center;
    border: 2px solid var(--primary-color);
}

.profile-avatar:hover {
    transform: scale(1.08);
    box-shadow: 0 0 15px rgba(19, 236, 200, 0.5);
    border-color: var(--primary-hover);
}
```

### Settings Profil Avatarı:
```css
.profile-avatar-large {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), #19d4b5);
    background-size: cover;
    background-position: center;
    border: 3px solid var(--primary-color);
    cursor: pointer;
}

.profile-avatar-upload {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: var(--transition);
}

.profile-avatar-large:hover .profile-avatar-upload {
    opacity: 1;
}
```

---

## JavaScript API

### Settings Manager
```javascript
class SettingsManager {
    // Profil şəklini yüklə
    handleProfileImageUpload(file)
    
    // Profil şəklini localStorage-dən oxu
    loadProfileImage()
    
    // Bütün avatar elementlərini yenilə
    updateProfileAvatars(imageData)
    
    // Profil bölməsinə scroll et
    scrollToProfileIfNeeded()
}
```

### Global App
```javascript
class FitLifeApp {
    // Profil avatarı navigasiyasını qur
    setupProfileAvatarNavigation()
    
    // Profil şəklini bütün səhifələrdə yüklə
    loadProfileImageOnAllPages()
}
```

---

## Qeydlər

### Məhdudiyyətlər:
- Şəkil ölçüsü çox böyük olarsa (>5MB), localStorage xətası baş verə bilər
- Base64 kodlaşdırma fayl ölçüsünü ~33% artırır
- Şəkil yalnız bu browser-də saxlanır (server sync yoxdur)

### Tövsiyələr:
- Optimal şəkil ölçüsü: 500KB-dan az
- Tövsiyə edilən ölçü: 200x200px və ya 400x400px
- Format: JPEG (kiçik ölçü) və ya PNG (keyfiyyət)

---

## Browser Dəstəyi

✅ Chrome/Edge (88+)  
✅ Firefox (85+)  
✅ Safari (14+)  
✅ Opera (74+)  

---

**Müəllif**: FitLife Development Team  
**Tarix**: 2025-10-13  
**Versiya**: 1.0
