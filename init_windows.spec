# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['py_view\\init_windows.py'],
    pathex=[],
    binaries=[],
    datas=[
    ('py_view/index.html', '.'),          
    ('py_view/list.js', '.'),
    ('py_view/install.js', '.'),              
    ('py_view/install.css', '.'),
    ('py_view/list.css', '.'),
    ('py_view/config.css', '.'),
    ('py_view/config.js', '.'),
    ('py_view/menu.css', '.'),
    ('py_view/emp.css', '.'),
    ('py_view/emp.js', '.'),           
    ('py_view/icons/desktop.svg', 'icons'),
    ('py_view/icons/user.svg', 'icons'),
    ('py_view/icons/config.svg', 'icons'),
    ('py_view/icons/config_connect.svg', 'icons'),
    ('py_view/icons/close.svg', 'icons')
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
    name='Gerenciador de Certificados',
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
    icon='icon.ico'
    
)
