# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['init_windows.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('index.html', '.'),          # inclui index.html
        ('index.js', '.'),            # inclui index.js
        ('styles.css', '.'),          # inclui styles.css
        ('icons/desktop.svg', 'icons'), # inclui ícone desktop
        ('icons/user.svg', 'icons')     # inclui ícone user
    ],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='init_windows',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
